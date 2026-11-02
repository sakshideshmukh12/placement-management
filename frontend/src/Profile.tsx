import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { API_ENDPOINTS_V1 } from "./utils/constants";
import { http } from "./api/http";

type UserProfile = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  rollNumber: string | null;
  branch: string | null;
  year: string | null;
  resumeUrl?: string | null;
};

type ProfileForm = {
  name: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  state: string;
  pincode: string;
};

type ProfileResponse = {
  message?: string;
  user?: UserProfile;
};

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const emptyForm: ProfileForm = {
  name: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  city: "",
  state: "",
  pincode: "",
};

const mapUserToForm = (user: UserProfile): ProfileForm => ({
  name: user.name ?? "",
  phone: user.phone ?? "",
  gender: user.gender ?? "",
  dateOfBirth: user.dateOfBirth
    ? user.dateOfBirth.slice(0, 10)
    : "",
  city: user.city ?? "",
  state: user.state ?? "",
  pincode: user.pincode ?? "",
});

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const apiError = error as ApiError;

  return (
    apiError.response?.data?.message ||
    apiError.message ||
    fallback
  );
};

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await http.get<ProfileResponse>(
          API_ENDPOINTS_V1.AUTH_ME,
        );

        if (!response.user) {
          throw new Error(
            "Profile data was not returned by the server.",
          );
        }

        setUser(response.user);
        setForm(mapUserToForm(response.user));
      } catch (err: unknown) {
        const apiError = err as ApiError;

        if (apiError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          getErrorMessage(err, "Unable to load your profile."),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [navigate]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleResumeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setResumeFile(null);
    setError("");
    setSuccess("");

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);

    try {
      const response = await http.patch<ProfileResponse>(
        API_ENDPOINTS_V1.AUTH_ME,
        {
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          gender: form.gender || null,
          dateOfBirth: form.dateOfBirth || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          pincode: form.pincode.trim() || null,
        },
      );

      if (!response.user) {
        throw new Error(
          "Updated profile data was not returned.",
        );
      }

      setUser(response.user);
      setForm(mapUserToForm(response.user));
      setSuccess(
        response.message || "Profile updated successfully.",
      );

      const cachedUserText = localStorage.getItem("user");

      if (cachedUserText) {
        try {
          const cachedUser = JSON.parse(cachedUserText);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...cachedUser,
              name: response.user.name,
            }),
          );
        } catch {
          // Ignore invalid cached user JSON.
        }
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;

      if (apiError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        getErrorMessage(err, "Unable to save your profile."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError("Please choose a PDF resume first.");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const data = new FormData();
      data.append("resume", resumeFile);

      const response = await http.post<{
        message?: string;
        resumeUrl?: string;
      }>(API_ENDPOINTS_V1.RESUME_UPLOAD, data);

      setSuccess(
        response.message || "Resume uploaded successfully.",
      );
      setResumeFile(null);

      const profileResponse = await http.get<ProfileResponse>(
        API_ENDPOINTS_V1.AUTH_ME,
      );

      if (profileResponse.user) {
        setUser(profileResponse.user);
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;

      if (apiError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        getErrorMessage(err, "Unable to upload your resume."),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDownload = async () => {
    setError("");
    setSuccess("");
    setDownloading(true);

    let blobUrl: string | null = null;

    try {
      const response = await http.get<Blob>(
        API_ENDPOINTS_V1.RESUME_DOWNLOAD,
        {
          responseType: "blob",
        },
      );

      blobUrl = window.URL.createObjectURL(response);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess("Resume download started.");
    } catch (err: unknown) {
      const apiError = err as ApiError;

      if (apiError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        getErrorMessage(
          err,
          "Unable to download your resume. Upload a resume first.",
        ),
      );
    }finally {
  if (blobUrl !== null) {
    window.URL.revokeObjectURL(blobUrl);
  }

  setDownloading(false);
}
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6fb",
        p: { xs: 2, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 850, mx: "auto" }}>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{ mb: 2 }}
        >
          ← Back to Dashboard
        </Button>

        <Typography
          variant="h4"
          sx={{ mb: 1, fontWeight: 700 }}
        >
          My Profile
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Manage your personal and academic details.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{ p: { xs: 2, md: 4 }, mb: 3 }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Academic Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              value={user?.email ?? ""}
              fullWidth
              disabled
            />

            <TextField
              label="Roll Number"
              value={user?.rollNumber ?? ""}
              fullWidth
              disabled
            />

            <TextField
              label="Branch"
              value={user?.branch ?? ""}
              fullWidth
              disabled
            />

            <TextField
              label="Year"
              value={user?.year ?? ""}
              fullWidth
              disabled
            />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: { xs: 2, md: 4 }, mb: 3 }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Personal Details
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">Prefer not to say</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              fullWidth
            />

            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              slotProps={{
                htmlInput: { maxLength: 6 },
              }}
              fullWidth
            />

            <Box
              sx={{
                gridColumn: { xs: "1", sm: "1 / -1" },
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: { xs: 2, md: 4 } }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: 700 }}
          >
            Resume
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Upload your resume as a PDF file. Maximum file size: 5 MB.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
          >
            <Button variant="outlined" component="label">
              Choose PDF
              <input
                type="file"
                hidden
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
              />
            </Button>

            <Typography
              variant="body2"
              sx={{ overflowWrap: "anywhere", flex: 1 }}
            >
              {resumeFile ? resumeFile.name : "No file selected"}
            </Typography>

            <Button
              variant="contained"
              onClick={handleResumeUpload}
              disabled={!resumeFile || uploading}
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleResumeDownload}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download Resume"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}