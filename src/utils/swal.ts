import Swal from "sweetalert2";
import { updatePost } from "@/api/posts";
import { updateBlog } from "@/api/blogs";
import { updateEvent } from "@/api/events";
import { updatePerson } from "@/api/peoples";

// Base themed Swal instance
export const themedSwal = Swal.mixin({
  customClass: {
    popup: "bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white rounded-xl shadow-xl font-thin",
    title: "text-lg font-elegant text-scara-gold dark:text-scara-gold",
    htmlContainer: "text-sm",
    confirmButton: "bg-wanderer-accent dark:bg-scara-primary text-white px-4 py-2 rounded hover:bg-wanderer-hover dark:hover:bg-scara-accent transition",
    cancelButton: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded ml-2",
  },
  buttonsStyling: false,
});

// ✅ Success alert
export const successSwal = (message: string) => {
  return themedSwal.fire({
    icon: "success",
    title: "Success!",
    text: message,
  });
};

// ✅ Error alert
export const errorSwal = (message: string) => {
  return themedSwal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
};

// ✅ Confirmation dialog
export const confirmSwal = (message: string) => {
  return themedSwal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
};
// edit post,blog,event, people
export const editPostSwal = async (
  post: { id: number; title: string; body: string },
  onSuccess: () => void
) => {
  const { value: formValues } = await themedSwal.fire({
    title: "Edit Post",
    html: `
      <div class="flex flex-col space-y-3 text-left">
        <input
          id="swal-title"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          placeholder="Post title"
          value="${post.title.replace(/"/g, "&quot;")}" />

        <textarea
          id="swal-body"
          class="swal2-textarea bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white resize-none"
          placeholder="What's on your mind?" rows="5"
        >${post.body}</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const title = (document.getElementById("swal-title") as HTMLInputElement)?.value.trim();
      const body = (document.getElementById("swal-body") as HTMLTextAreaElement)?.value.trim();

      if (!title || !body) {
        themedSwal.showValidationMessage("Both title and body are required.");
        return;
      }

      return { title, body };
    },
  });

  if (formValues) {
    try {
      await updatePost(post.id, formValues);
      await successSwal("Post updated.");
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
};

export const editBlogSwal = async (
  blog: { id: number; title: string; summary: string; body: string },
  onSuccess: () => void
) => {
  const { value: formValues } = await themedSwal.fire({
    title: "Edit Blog",
    html: `
      <div class="flex flex-col space-y-3 text-left">
        <input
          id="swal-title"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          placeholder="Blog title"
          value="${blog.title.replace(/"/g, "&quot;")}" />

        <input
          id="swal-summary"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          placeholder="Blog summary"
          value="${blog.summary.replace(/"/g, "&quot;")}" />

        <textarea
          id="swal-body"
          class="swal2-textarea bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white resize-none"
          placeholder="Blog content..." rows="5"
        >${blog.body}</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update",
    preConfirm: () => {
      const title = (document.getElementById("swal-title") as HTMLInputElement)?.value.trim();
      const summary = (document.getElementById("swal-summary") as HTMLInputElement)?.value.trim();
      const body = (document.getElementById("swal-body") as HTMLTextAreaElement)?.value.trim();

      if (!title || !body) {
        themedSwal.showValidationMessage("Title and Body are required.");
        return;
      }

      return { title, summary, body };
    },
  });

  if (formValues) {
    try {
      await updateBlog(blog.id, formValues);
      await successSwal("Blog updated.");
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
};

export const editEventSwal = async (
  event: { id: number; title: string; location: string; time: string },
  onSuccess: () => void
) => {
  const { value: formValues } = await themedSwal.fire({
    title: "Edit Event",
    html: `
      <div class="flex flex-col space-y-3 text-left">
        <input
          id="swal-title"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          placeholder="Event title"
          value="${event.title.replace(/"/g, "&quot;")}" />

        <input
          id="swal-location"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          placeholder="Location"
          value="${event.location.replace(/"/g, "&quot;")}" />

        <input
          id="swal-time"
          type="datetime-local"
          class="swal2-input bg-transparent border border-scara-primary dark:border-scara-primary rounded text-sm placeholder-scara-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white"
          value="${new Date(event.time).toISOString().slice(0, 16)}" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update",
    preConfirm: () => {
      const title = (document.getElementById("swal-title") as HTMLInputElement)?.value.trim();
      const location = (document.getElementById("swal-location") as HTMLInputElement)?.value.trim();
      const time = (document.getElementById("swal-time") as HTMLInputElement)?.value;

      if (!title || !time) {
        themedSwal.showValidationMessage("Title and time are required.");
        return;
      }

      return { title, location, time };
    },
  });

  if (formValues) {
    try {
      await updateEvent(event.id, formValues);
      await successSwal("Event updated.");
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
};

export const editPersonSwal = async (
  person: { id: number; name: string; email: string; bio?: string | null },
  onSuccess: () => void
) => {
  const { value: formValues } = await themedSwal.fire({
    title: "Edit Profile",
    html: `
      <div class="flex flex-col space-y-3 text-left">
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${person.name}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${person.email}" />
        <textarea id="swal-bio" class="swal2-textarea" placeholder="Bio" rows="4">${person.bio || ""}</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const name = (document.getElementById("swal-name") as HTMLInputElement)?.value.trim();
      const email = (document.getElementById("swal-email") as HTMLInputElement)?.value.trim();
      const bio = (document.getElementById("swal-bio") as HTMLTextAreaElement)?.value.trim();

      if (!name || !email) {
        themedSwal.showValidationMessage("Name and Email are required.");
        return;
      }

      return { name, email, bio };
    },
  });

  if (formValues) {
    try {
      await updatePerson(person.id, formValues);
      await successSwal("Profile updated.");
      onSuccess(); // Refresh or reload state in the caller
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
};


// summary
export const showSummarySwal = (summary: string) => {
  return themedSwal.fire({
    title: "Summary",
    html: `<div class="text-left whitespace-pre-wrap">${summary}</div>`,
    icon: "info",
    confirmButtonText: "Close",
  });
};

