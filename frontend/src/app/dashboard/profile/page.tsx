"use client";

import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Save,
  Loader2,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";


interface UserProfile {
  id: string;
  name: string;
  email: string;
  img: string | null;
  phone: string | null;
  location: string | null;
  description: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  youtubeUrl: string | null;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  youtubeUrl: string;
}

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [form, setForm] =
    useState<ProfileForm>({
      name: "",
      email: "",
      phone: "",
      location: "",
      description: "",
      githubUrl: "",
      linkedinUrl: "",
      resumeUrl: "",
      youtubeUrl: "",
    });

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * =========================================================
   * FETCH PROFILE
   * =========================================================
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getApi(
            "/users/get-me",
            true,
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load profile",
          );
        }

        const data =
          result.data ?? result;

        console.log(
          "Profile data:",
          data,
        );

        setProfile(data);

        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location:
            data.location ?? "",
          description:
            data.description ?? "",
          githubUrl:
            data.githubUrl ?? "",
          linkedinUrl:
            data.linkedinUrl ?? "",
          resumeUrl:
            data.resumeUrl ?? "",
          youtubeUrl:
            data.youtubeUrl ?? "",
        });

        setImagePreview(
          data.img ?? null,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * =========================================================
   * INPUT CHANGE
   * =========================================================
   */
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * =========================================================
   * IMAGE CHANGE
   * =========================================================
   */
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Please select a valid image file.",
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5MB.",
      );
      return;
    }

    setError("");

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
   * =========================================================
   * SUBMIT PROFILE
   * =========================================================
   */
  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      /*
       * FormData is required because
       * we are also sending an image file.
       */
      const formData =
        new FormData();

      /*
       * =====================================================
       * REQUIRED FIELDS
       * =====================================================
       */
      formData.append(
        "name",
        form.name.trim(),
      );

      formData.append(
        "email",
        form.email.trim(),
      );

      /*
       * =====================================================
       * OPTIONAL FIELDS
       * =====================================================
       */
      if (form.phone.trim()) {
        formData.append(
          "phone",
          form.phone.trim(),
        );
      }

      if (
        form.location.trim()
      ) {
        formData.append(
          "location",
          form.location.trim(),
        );
      }

      if (
        form.description.trim()
      ) {
        formData.append(
          "description",
          form.description.trim(),
        );
      }

      if (
        form.githubUrl.trim()
      ) {
        formData.append(
          "githubUrl",
          form.githubUrl.trim(),
        );
      }

      if (
        form.linkedinUrl.trim()
      ) {
        formData.append(
          "linkedinUrl",
          form.linkedinUrl.trim(),
        );
      }

      if (
        form.youtubeUrl.trim()
      ) {
        formData.append(
          "youtubeUrl",
          form.youtubeUrl.trim(),
        );
      }

      if (
        form.resumeUrl.trim()
      ) {
        formData.append(
          "resumeUrl",
          form.resumeUrl.trim(),
        );
      }

      /*
       * =====================================================
       * PROFILE IMAGE
       * =====================================================
       */
      if (selectedImage) {
        formData.append(
          "img",
          selectedImage,
        );
      }

      /*
       * =====================================================
       * DEBUG
       * =====================================================
       */
      console.log(
        "Email being sent:",
        form.email.trim(),
      );

      console.log(
        "YouTube URL being sent:",
        form.youtubeUrl.trim(),
      );

      /*
       * =====================================================
       * PATCH REQUEST
       * =====================================================
       *
       * callApi handles:
       *
       * 1. Auth token
       * 2. Authorization header
       * 3. Token renewal
       * 4. Automatic retry
       *
       * FormData is preserved by callApi.
       */
      const response =
        await callApi(
          `/users/${profile.id}`,
          "PATCH",
          formData,
          true,
        );

      const result =
        await response.json();

      console.log(
        "Update response:",
        result,
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update profile",
        );
      }

      const updatedProfile =
        result.data ?? result;

      /*
       * =====================================================
       * UPDATE LOCAL STATE
       * =====================================================
       */
      setProfile(
        updatedProfile,
      );

      setForm({
        name:
          updatedProfile.name ??
          "",

        email:
          updatedProfile.email ??
          "",

        phone:
          updatedProfile.phone ??
          "",

        location:
          updatedProfile.location ??
          "",

        description:
          updatedProfile.description ??
          "",

        githubUrl:
          updatedProfile.githubUrl ??
          "",

        linkedinUrl:
          updatedProfile.linkedinUrl ??
          "",

        resumeUrl:
          updatedProfile.resumeUrl ??
          "",

        youtubeUrl:
          updatedProfile.youtubeUrl ??
          "",
      });

      /*
       * Clear selected image after
       * successful upload.
       */
      setSelectedImage(null);

      setImagePreview(
        updatedProfile.img ??
          null,
      );

      setSuccess(
        "Profile updated successfully.",
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-white/60"
        />
      </div>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Profile
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Manage your personal and
          professional information.
        </p>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}
      {error && (
        <div
          className="
            mb-5 rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-4 py-3 text-sm text-red-300
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
          ===================================================== */}
      {success && (
        <div
          className="
            mb-5 rounded-2xl border
            border-green-400/20 bg-green-500/10
            px-4 py-3 text-sm text-green-300
          "
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ===================================================
            PROFILE IMAGE
            =================================================== */}
        <div
          className="
            rounded-3xl border border-white/20
            bg-white/5 p-6
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xs
          "
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* IMAGE */}
            <div
              className="
                relative h-28 w-28 shrink-0
                overflow-hidden rounded-full
                border border-white/20
                bg-white/10
              "
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={
                    form.name ||
                    "Profile"
                  }
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="
                    flex h-full w-full
                    items-center
                    justify-center
                    text-white/30
                  "
                >
                  <User size={38} />
                </div>
              )}
            </div>

            {/* IMAGE INFORMATION */}
            <div>
              <h2 className="text-lg font-medium text-white">
                Profile Picture
              </h2>

              <p className="mt-1 text-sm text-white/40">
                JPG, PNG or WebP.
                Maximum 5MB.
              </p>

              <label
                className="
                  mt-4 inline-flex
                  cursor-pointer
                  items-center gap-2
                  rounded-xl
                  border border-white/20
                  bg-white/10
                  px-4 py-2
                  text-sm text-white
                  transition
                  hover:bg-white/15
                "
              >
                <Upload size={16} />

                Change Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ===================================================
            PERSONAL INFORMATION
            =================================================== */}
        <div
          className="
            rounded-3xl border border-white/20
            bg-white/5 p-6
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xs
          "
        >
          <h2 className="mb-6 text-lg font-medium text-white">
            Personal Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              icon={
                <User size={17} />
              }
              label="Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              required
            />

            <InputField
              icon={
                <Mail size={17} />
              }
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={
                handleChange
              }
              required
            />

            <InputField
              icon={
                <Phone size={17} />
              }
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={
                handleChange
              }
            />

            <InputField
              icon={
                <MapPin size={17} />
              }
              label="Location"
              name="location"
              value={form.location}
              onChange={
                handleChange
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5">
            <label className="mb-2 block text-sm text-white/60">
              Description
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              rows={5}
              placeholder="Tell people about yourself..."
              className="
                w-full resize-none
                rounded-2xl
                border border-white/15
                bg-white/5
                px-4 py-3
                text-sm text-white
                outline-none
                placeholder:text-white/25
                focus:border-white/30
                focus:bg-white/10
              "
            />
          </div>
        </div>

        {/* ===================================================
            PROFESSIONAL LINKS
            =================================================== */}
        <div
          className="
            rounded-3xl border border-white/20
            bg-white/5 p-6
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xs
          "
        >
          <h2 className="mb-6 text-lg font-medium text-white">
            Professional Links
          </h2>

          <div className="space-y-5">
            {/* GITHUB */}
            <InputField
              icon={
                <FaGithub size={17} />
              }
              label="GitHub URL"
              name="githubUrl"
              value={
                form.githubUrl
              }
              onChange={
                handleChange
              }
              placeholder="https://github.com/..."
            />

            {/* LINKEDIN */}
            <InputField
              icon={
                <FaLinkedin size={17} />
              }
              label="LinkedIn URL"
              name="linkedinUrl"
              value={
                form.linkedinUrl
              }
              onChange={
                handleChange
              }
              placeholder="https://linkedin.com/in/..."
            />

            {/* YOUTUBE */}
            <InputField
              icon={
                <FaYoutube size={17} />
              }
              label="YouTube URL"
              name="youtubeUrl"
              value={
                form.youtubeUrl
              }
              onChange={
                handleChange
              }
              placeholder="https://youtube.com/@..."
            />

            {/* RESUME */}
            <InputField
              icon={
                <FileText size={17} />
              }
              label="Resume URL"
              name="resumeUrl"
              value={
                form.resumeUrl
              }
              onChange={
                handleChange
              }
              placeholder="https://..."
            />
          </div>
        </div>

        {/* ===================================================
            SAVE BUTTON
            =================================================== */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              border border-white/20
              bg-white/10
              px-6 py-3
              text-sm font-medium
              text-white
              shadow-lg
              backdrop-blur-xs
              transition
              hover:bg-white/15
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/*
 * ===========================================================
 * REUSABLE INPUT
 * ===========================================================
 */

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <div className="relative">
        <div
          className="
            pointer-events-none
            absolute left-4
            top-1/2
            -translate-y-1/2
            text-white/35
          "
        >
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full
            rounded-2xl
            border border-white/15
            bg-white/5
            py-3 pl-11 pr-4
            text-sm text-white
            outline-none
            placeholder:text-white/25
            focus:border-white/30
            focus:bg-white/10
          "
        />
      </div>
    </div>
  );
}