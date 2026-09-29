"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Save,
  Plus,
  X,
} from "lucide-react";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

interface BannerQuote {
  id: string;
  primaryText: string[];
  secondaryText: string[];
}

export default function Banner() {
  const [banner, setBanner] =
    useState<BannerQuote | null>(null);

  const [primaryText, setPrimaryText] =
    useState<string[]>([""]);

  const [secondaryText, setSecondaryText] =
    useState<string[]>([""]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getApi(
            "/banner-quote",
            true,
          );

        const result =
          await response.json();

        if (!response.ok) {
          if (
            response.status === 404
          ) {
            setBanner(null);
            return;
          }

          throw new Error(
            result.message ||
              "Failed to load banner quote",
          );
        }

        const data =
          result.data ?? result;

        setBanner(data);

        setPrimaryText(
          data.primaryText?.length
            ? data.primaryText
            : [""],
        );

        setSecondaryText(
          data.secondaryText?.length
            ? data.secondaryText
            : [""],
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

    fetchBanner();
  }, []);

  const handlePrimaryChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      event.target.value;

    setPrimaryText(
      (previous) =>
        previous.map(
          (text, itemIndex) =>
            itemIndex === index
              ? value
              : text,
        ),
    );
  };

  const handleSecondaryChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      event.target.value;

    setSecondaryText(
      (previous) =>
        previous.map(
          (text, itemIndex) =>
            itemIndex === index
              ? value
              : text,
        ),
    );
  };

  const addPrimaryText = () => {
    setPrimaryText(
      (previous) => [
        ...previous,
        "",
      ],
    );
  };

  const addSecondaryText = () => {
    setSecondaryText(
      (previous) => [
        ...previous,
        "",
      ],
    );
  };

  const removePrimaryText = (
    index: number,
  ) => {
    setPrimaryText(
      (previous) => {
        if (previous.length === 1) {
          return [""];
        }

        return previous.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        );
      },
    );
  };

  const removeSecondaryText = (
    index: number,
  ) => {
    setSecondaryText(
      (previous) => {
        if (previous.length === 1) {
          return [""];
        }

        return previous.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        );
      },
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanedPrimaryText =
      primaryText
        .map((text) => text.trim())
        .filter(Boolean);

    const cleanedSecondaryText =
      secondaryText
        .map((text) => text.trim())
        .filter(Boolean);

    if (
      cleanedPrimaryText.length ===
      0
    ) {
      setError(
        "Add at least one primary text.",
      );
      return;
    }

    if (
      cleanedSecondaryText.length ===
      0
    ) {
      setError(
        "Add at least one secondary text.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        primaryText:
          cleanedPrimaryText,
        secondaryText:
          cleanedSecondaryText,
      };

      const response =
        await callApi(
          banner
            ? "/banner-quote"
            : "/banner-quote",
          banner
            ? "PATCH"
            : "POST",
          payload,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(
            result?.message,
          )
            ? result.message.join(", ")
            : result?.message ||
                "Failed to save banner quote",
        );
      }

      const data =
        result.data ?? result;

      setBanner(data);

      setPrimaryText(
        data.primaryText ?? [],
      );

      setSecondaryText(
        data.secondaryText ?? [],
      );

      setSuccess(
        banner
          ? "Banner quote updated successfully."
          : "Banner quote created successfully.",
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

  if (loading) {
    return (
      <div
        className="
          rounded-3xl border border-white/20
          bg-white/5 p-6
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
          backdrop-blur-xs
        "
      >
        <div className="flex items-center gap-3 text-sm text-white/50">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading banner...
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-3xl border border-white/20
        bg-white/5 p-6
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xs
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">
          Banner Quote
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Manage the primary and secondary
          text displayed in your banner.
        </p>
      </div>

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
        className="space-y-7"
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-white/80">
                Primary Text
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Bold or highlighted banner text.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addPrimaryText
              }
              className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-xl
                border border-white/15
                bg-white/5
                px-3
                text-xs
                text-white/60
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <Plus size={15} />

              Add
            </button>
          </div>

          <div className="space-y-3">
            {primaryText.map(
              (text, index) => (
                <div
                  key={`primary-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(event) =>
                      handlePrimaryChange(
                        index,
                        event,
                      )
                    }
                    placeholder="Primary banner text"
                    className="
                      min-w-0
                      flex-1
                      rounded-2xl
                      border border-white/15
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/25
                      focus:border-white/30
                      focus:bg-white/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removePrimaryText(
                        index,
                      )
                    }
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      text-white/35
                      transition
                      hover:bg-red-500/10
                      hover:text-red-300
                    "
                    title="Remove text"
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-white/80">
                Secondary Text
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Supporting text displayed below.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addSecondaryText
              }
              className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-xl
                border border-white/15
                bg-white/5
                px-3
                text-xs
                text-white/60
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <Plus size={15} />

              Add
            </button>
          </div>

          <div className="space-y-3">
            {secondaryText.map(
              (text, index) => (
                <div
                  key={`secondary-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(event) =>
                      handleSecondaryChange(
                        index,
                        event,
                      )
                    }
                    placeholder="Secondary banner text"
                    className="
                      min-w-0
                      flex-1
                      rounded-2xl
                      border border-white/15
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/25
                      focus:border-white/30
                      focus:bg-white/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSecondaryText(
                        index,
                      )
                    }
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      text-white/35
                      transition
                      hover:bg-red-500/10
                      hover:text-red-300
                    "
                    title="Remove text"
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-5">
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

                {banner
                  ? "Update Banner"
                  : "Create Banner"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}