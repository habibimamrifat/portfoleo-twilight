"use client";

import Card from "../common/Card";
import {
  Mail,
} from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Contact
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Let's build something.
          </h2>
        </div>

        <Card className="p-8 lg:p-10">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-semibold">
              Have a project in mind?
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/50">
              Tell me what you re building, what problem you re
              trying to solve, and where you need help. I ll get
              back to you with the next steps.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:hello@example.com"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white/20"
              >
                <Mail size={16} />
                Email Me
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                {/* <Github size={17} /> */}
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                {/* <Linkedin size={17} /> */}
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}