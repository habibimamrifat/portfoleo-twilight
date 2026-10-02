"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { callApi } from "@/api/callApi";

interface CreateProjectApproachProps {
  projectId: string;
  onCreated: () => void;
}

export default function CreateProjectApproach({
  projectId,
  onCreated,
}: CreateProjectApproachProps) {
  const [approachTitle, setApproachTitle] =
    useState("");

  const [details, setDetails] =
    useState<string[]>([""]);

  const [approachImg, setApproachImg] =
    useState<File | null>(null);

  const [sortOrder, setSortOrder] =
    useState("0");

  const [isActive, setIsActive] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const addDetail = () => {
    setDetails((previous) => [
      ...previous,
      "",
    ]);
  };

  const removeDetail = (
    index: number,
  ) => {
    setDetails((previous) => {
      if (previous.length === 1) {
        return [""];
      }

      return previous.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      );
    });
  };

  const updateDetail = (
    index: number,
    value: string,
  ) => {
    setDetails((previous) =>
      previous.map(
        (detail, itemIndex) =>
          itemIndex === index
            ? value
            : detail,
      ),
    );
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    setApproachImg(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const cleanedDetails = details
      .map((detail) => detail.trim())
      .filter(Boolean);

    if (!approachTitle.trim()) {
      setError(
        "Approach title is required.",
      );
      return;
    }

    if (!cleanedDetails.length) {
      setError(
        "Add at least one approach detail.",
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "approachTitle",
        approachTitle.trim(),
      );

      cleanedDetails.forEach((detail) => {
        formData.append(
          "detail",
          detail,
        );
      });

      formData.append(
        "sortOrder",
        sortOrder || "0",
      );

      formData.append(
        "isActive",
        String(isActive),
      );

      if (approachImg) {
        formData.append(
          "approachImg",
          approachImg,
        );
      }

      const response = await callApi(
        `/projects/${projectId}/approaches`,
        "POST",
        formData,
        true,
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message ||
                "Failed to create project approach.",
        );
      }

      setApproachTitle("");
      setDetails([""]);
      setApproachImg(null);
      setSortOrder("0");
      setIsActive(true);

      const imageInput =
        document.getElementById(
          `project-approach-image-${projectId}`,
        ) as HTMLInputElement | null;

      if (imageInput) {
        imageInput.value = "";
      }

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl
        border border-white/10
        bg-white/[0.03]
        p-5
      "
    >
      <div className="mb-5">
        <h3 className="text-sm font-medium text-white">
          Add Project Approach
        </h3>

        <p className="mt-1 text-xs text-white/35">
          Add how this project was approached or
          implemented.
        </p>
      </div>

      {error && (
        <div
          className="
            mb-5 rounded-xl
            border border-red-400/20
            bg-red-500/10
            px-4 py-3
            text-sm text-red-300
          "
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs text-white/50">
            Approach Title
          </label>

          <input
            type="text"
            value={approachTitle}
            onChange={(event) =>
              setApproachTitle(
                event.target.value,
              )
            }
            placeholder="e.g. Scalable Backend Architecture"
            className="
              w-full rounded-xl
              border border-white/15
              bg-white/5
              px-4 py-3
              text-sm text-white
              outline-none
              placeholder:text-white/25
              focus:border-white/30
            "
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <label className="block text-xs text-white/50">
                Details
              </label>

              <p className="mt-1 text-[11px] text-white/30">
                Add one detail per item.
              </p>
            </div>

            <button
              type="button"
              onClick={addDetail}
              className="
                inline-flex h-9
                items-center gap-2
                rounded-xl
                border border-white/15
                bg-white/5
                px-3
                text-xs text-white/60
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {details.map(
              (detail, index) => (
                <div
                  key={`detail-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={detail}
                    onChange={(event) =>
                      updateDetail(
                        index,
                        event.target.value,
                      )
                    }
                    placeholder={`Detail ${index + 1}`}
                    className="
                      min-w-0 flex-1
                      rounded-xl
                      border border-white/15
                      bg-white/5
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeDetail(index)
                    }
                    className="
                      flex h-11 w-11
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      text-white/35
                      transition
                      hover:bg-red-500/10
                      hover:text-red-300
                    "
                    title="Remove detail"
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/50">
            Approach Image
          </label>

          <label
            htmlFor={`project-approach-image-${projectId}`}
            className="
              flex cursor-pointer
              items-center gap-3
              rounded-xl
              border border-dashed
              border-white/15
              bg-white/[0.03]
              px-4 py-4
              transition
              hover:bg-white/[0.06]
            "
          >
            <ImagePlus
              size={20}
              className="text-white/40"
            />

            <div className="min-w-0">
              <p className="text-sm text-white/60">
                {approachImg
                  ? approachImg.name
                  : "Choose an image"}
              </p>

              <p className="mt-1 text-xs text-white/30">
                Optional
              </p>
            </div>
          </label>

          <input
            id={`project-approach-image-${projectId}`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Sort Order
            </label>

            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value,
                )
              }
              className="
                w-full rounded-xl
                border border-white/15
                bg-white/5
                px-4 py-3
                text-sm text-white
                outline-none
                focus:border-white/30
              "
            />
          </div>

          <label
            className="
              flex items-center gap-3
              rounded-xl
              border border-white/10
              bg-white/[0.03]
              px-4
            "
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm text-white/60">
              Active
            </span>
          </label>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center gap-2
              rounded-xl
              border border-white/20
              bg-white/10
              px-5 py-3
              text-sm font-medium
              text-white
              transition
              hover:bg-white/15
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Create Approach
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}