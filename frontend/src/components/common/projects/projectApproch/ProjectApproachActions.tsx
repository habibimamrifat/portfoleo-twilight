"use client";

import {
  useState,
} from "react";

import {
  Edit3,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { callApi } from "@/api/callApi";

import type {
  ProjectApproachData,
} from "./EachProjectApproachCard";

interface ProjectApproachActionsProps {
  projectId: string;
  approachId: string;
  approach: ProjectApproachData;
  isAdmin?: boolean;
  onChanged: () => void;
}

export default function ProjectApproachActions({
  projectId,
  approachId,
  approach,
  isAdmin = false,
  onChanged,
}: ProjectApproachActionsProps) {
  const [updating, setUpdating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [approachTitle, setApproachTitle] =
    useState(
      approach.approachTitle,
    );

  const [details, setDetails] =
    useState<string[]>(
      approach.detail,
    );

  const [sortOrder, setSortOrder] =
    useState(
      String(approach.sortOrder),
    );

  const [isActive, setIsActive] =
    useState(
      approach.isActive,
    );

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

  const addDetail = () => {
    setDetails((previous) => [
      ...previous,
      "",
    ]);
  };

  const removeDetail = (
    index: number,
  ) => {
    setDetails((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  };

  const handleUpdate = async () => {
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
        "At least one detail is required.",
      );
      return;
    }

    try {
      setUpdating(true);
      setError("");

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

      const response =
        await callApi(
          `/projects/${projectId}/approaches/${approachId}`,
          "PATCH",
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
                "Failed to update project approach.",
        );
      }

      setEditing(false);
      onChanged();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project approach?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response =
        await callApi(
          `/projects/${projectId}/approaches/${approachId}`,
          "DELETE",
          undefined,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message ||
                "Failed to delete project approach.",
        );
      }

      onChanged();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (editing) {
    return (
      <div
        className="
          w-full
          max-w-xl
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          p-4
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">
            Update Approach
          </h4>

          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError("");
            }}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-white/40
              hover:bg-white/10
              hover:text-white
            "
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div
            className="
              mb-4 rounded-xl
              border border-red-400/20
              bg-red-500/10
              px-3 py-2
              text-xs text-red-300
            "
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            value={approachTitle}
            onChange={(event) =>
              setApproachTitle(
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

          <div className="space-y-2">
            {details.map(
              (detail, index) => (
                <div
                  key={`${approachId}-edit-${index}`}
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
                    className="
                      min-w-0 flex-1
                      rounded-xl
                      border border-white/15
                      bg-white/5
                      px-4 py-3
                      text-sm text-white
                      outline-none
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
                      text-white/40
                      hover:bg-red-500/10
                      hover:text-red-300
                    "
                  >
                    <X size={15} />
                  </button>
                </div>
              ),
            )}

            <button
              type="button"
              onClick={addDetail}
              className="
                text-xs
                text-white/40
                hover:text-white
              "
            >
              + Add detail
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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

            <label
              className="
                flex items-center gap-3
                rounded-xl
                border border-white/10
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

          <button
            type="button"
            onClick={handleUpdate}
            disabled={updating}
            className="
              inline-flex
              items-center gap-2
              rounded-xl
              border border-white/20
              bg-white/10
              px-4 py-2.5
              text-sm text-white
              hover:bg-white/15
              disabled:opacity-50
            "
          >
            {updating ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Edit3 size={15} />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setError("");
          setEditing(true);
        }}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-xl
          border border-white/10
          bg-white/5
          text-white/40
          transition
          hover:bg-white/10
          hover:text-white
        "
        title="Update approach"
      >
        <Edit3 size={15} />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-xl
          border border-white/10
          bg-white/5
          text-white/40
          transition
          hover:bg-red-500/10
          hover:text-red-300
          disabled:opacity-50
        "
        title="Delete approach"
      >
        {deleting ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}