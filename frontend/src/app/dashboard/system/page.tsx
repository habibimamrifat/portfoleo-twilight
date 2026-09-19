"use client";

import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Save,
  Palette,
  Sparkles,
  Layers3,
  MousePointer2,
} from "lucide-react";

interface SystemSettings {
  id: string;
  userId: string;

  backgroundColor: string | null;
  moonlightColor: string | null;

  particleCount: number | null;
  particleColor: string | null;

  particleLinksEnabled: boolean | null;
  particleLinkColor: string | null;

  cardColor: string | null;
  buttonColor: string | null;
}

interface SystemForm {
  backgroundColor: string;
  moonlightColor: string;

  particleCount: string;
  particleColor: string;

  particleLinksEnabled: boolean;
  particleLinkColor: string;

  cardColor: string;
  buttonColor: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const DEFAULT_SETTINGS: SystemForm = {
  backgroundColor: "#000000",
  moonlightColor: "#172554",

  particleCount: "80",
  particleColor: "#ffffff",

  particleLinksEnabled: true,
  particleLinkColor: "#ffffff",

  cardColor: "#ffffff",
  buttonColor: "#ffffff",
};

export default function SystemPage() {
  const [settings, setSettings] =
    useState<SystemSettings | null>(null);

  const [form, setForm] =
    useState<SystemForm>(
      DEFAULT_SETTINGS,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load current settings
   */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/system`,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load system settings",
          );
        }

        const data =
          result.data ?? result;

        if (!data) {
          setSettings(null);
          setForm(DEFAULT_SETTINGS);
          return;
        }

        setSettings(data);

        setForm({
          backgroundColor:
            data.backgroundColor ??
            DEFAULT_SETTINGS.backgroundColor,

          moonlightColor:
            data.moonlightColor ??
            DEFAULT_SETTINGS.moonlightColor,

          particleCount:
            String(
              data.particleCount ??
                DEFAULT_SETTINGS.particleCount,
            ),

          particleColor:
            data.particleColor ??
            DEFAULT_SETTINGS.particleColor,

          particleLinksEnabled:
            data.particleLinksEnabled ??
            DEFAULT_SETTINGS.particleLinksEnabled,

          particleLinkColor:
            data.particleLinkColor ??
            DEFAULT_SETTINGS.particleLinkColor,

          cardColor:
            data.cardColor ??
            DEFAULT_SETTINGS.cardColor,

          buttonColor:
            data.buttonColor ??
            DEFAULT_SETTINGS.buttonColor,
        });
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

    fetchSettings();
  }, []);

  /*
   * Input change
   */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
   * Save
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("portfolio");

      if (!token) {
        throw new Error(
          "Authentication token not found",
        );
      }

      const body = {
        backgroundColor:
          form.backgroundColor,

        moonlightColor:
          form.moonlightColor,

        particleCount:
          Number(form.particleCount),

        particleColor:
          form.particleColor,

        particleLinksEnabled:
          form.particleLinksEnabled,

        particleLinkColor:
          form.particleLinkColor,

        cardColor:
          form.cardColor,

        buttonColor:
          form.buttonColor,
      };

      const response = await fetch(
        `${API_URL}/system/upsert`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save system settings",
        );
      }

      const updatedSettings =
        result.data ?? result;

      setSettings(updatedSettings);

      setSuccess(
        "System settings saved successfully.",
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
   * Loading
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

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          System Settings
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Control the visual appearance of your
          portfolio.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-red-400/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-green-400/20
            bg-green-500/10
            px-4
            py-3
            text-sm
            text-green-300
          "
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BACKGROUND */}
        <SettingsCard
          icon={<Palette size={19} />}
          title="Background"
          description="Configure the main visual background."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <ColorField
              label="Background Color"
              name="backgroundColor"
              value={
                form.backgroundColor
              }
              onChange={handleChange}
            />

            <ColorField
              label="Moonlight Color"
              name="moonlightColor"
              value={
                form.moonlightColor
              }
              onChange={handleChange}
            />
          </div>
        </SettingsCard>

        {/* PARTICLES */}
        <SettingsCard
          icon={<Sparkles size={19} />}
          title="Particles"
          description="Control the particle background."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Particle Count"
              name="particleCount"
              type="number"
              value={
                form.particleCount
              }
              onChange={handleChange}
              min="0"
              placeholder="80"
            />

            <ColorField
              label="Particle Color"
              name="particleColor"
              value={
                form.particleColor
              }
              onChange={handleChange}
            />

            <ColorField
              label="Particle Link Color"
              name="particleLinkColor"
              value={
                form.particleLinkColor
              }
              onChange={handleChange}
            />

            <div className="flex items-end">
              <label
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/5
                  px-4
                  py-3
                  transition
                  hover:bg-white/10
                "
              >
                <div>
                  <p className="text-sm text-white/80">
                    Particle Links
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Connect nearby particles
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="particleLinksEnabled"
                  checked={
                    form.particleLinksEnabled
                  }
                  onChange={handleChange}
                  className="
                    h-5
                    w-5
                    cursor-pointer
                    accent-white
                  "
                />
              </label>
            </div>
          </div>
        </SettingsCard>

        {/* CARDS */}
        <SettingsCard
          icon={<Layers3 size={19} />}
          title="Cards"
          description="Control the glass card appearance."
        >
          <div className="max-w-md">
            <ColorField
              label="Card Color"
              name="cardColor"
              value={form.cardColor}
              onChange={handleChange}
            />
          </div>
        </SettingsCard>

        {/* BUTTONS */}
        <SettingsCard
          icon={<MousePointer2 size={19} />}
          title="Buttons"
          description="Control your portfolio button color."
        >
          <div className="max-w-md">
            <ColorField
              label="Button Color"
              name="buttonColor"
              value={form.buttonColor}
              onChange={handleChange}
            />
          </div>
        </SettingsCard>

        {/* SAVE */}
        <div className="flex justify-end pb-6">
          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              border
              border-white/20
              bg-white/10
              px-6
              py-3
              text-sm
              font-medium
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
 * ============================================================
 * SETTINGS CARD
 * ============================================================
 */

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/20
        bg-white/5
        p-6
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xs
      "
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/15
            bg-white/5
            text-white/70
          "
        >
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-medium text-white">
            {title}
          </h2>

          <p className="text-sm text-white/40">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

/*
 * ============================================================
 * INPUT FIELD
 * ============================================================
 */

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  min?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  min,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        min={min}
        onChange={onChange}
        className="
          w-full
          rounded-2xl
          border
          border-white/15
          bg-white/5
          px-4
          py-3
          text-sm
          text-white
          outline-none
          placeholder:text-white/25
          focus:border-white/30
          focus:bg-white/10
        "
      />
    </div>
  );
}

/*
 * ============================================================
 * COLOR FIELD
 * ============================================================
 */

interface ColorFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

function ColorField({
  label,
  name,
  value,
  onChange,
}: ColorFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/15
          bg-white/5
          p-2
        "
      >
        <input
          type="color"
          name={name}
          value={
            value || "#000000"
          }
          onChange={onChange}
          className="
            h-10
            w-12
            cursor-pointer
            rounded-xl
            border-0
            bg-transparent
            p-0
          "
        />

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="#ffffff"
          className="
            min-w-0
            flex-1
            bg-transparent
            px-2
            py-2
            text-sm
            text-white
            outline-none
            placeholder:text-white/25
          "
        />
      </div>
    </div>
  );
}