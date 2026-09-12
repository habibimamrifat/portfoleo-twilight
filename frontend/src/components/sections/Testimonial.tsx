"use client";

import Card from "../common/Card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Client One",
    role: "Product Manager",
    message:
      "Habib was reliable, communicative and focused on solving the actual problem rather than just writing code.",
  },
  {
    name: "Client Two",
    role: "Startup Founder",
    message:
      "The project was delivered with a strong focus on backend structure and long-term maintainability.",
  },
  {
    name: "Client Three",
    role: "Developer",
    message:
      "A thoughtful developer who cares about understanding the system and continuously improving his work.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Testimonials
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            What people say.
          </h2>
        </div>

        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="p-7"
            >
              <Quote
                size={22}
                className="text-blue-400"
              />

              <p className="mt-5 text-sm leading-7 text-white/60">
                "{testimonial.message}"
              </p>

              <div className="mt-6">
                <p className="text-sm font-semibold">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {testimonial.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}