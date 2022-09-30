import Tags from "../components/Tags";
import React, { useState } from "react";

import questions from "../../content/privacy-policy.json";
import { useFormspark } from "@formspark/use-formspark";

export default function Faq() {
  const [submit, submitting] = useFormspark({
    formId: "lMcR2WFx",
  });

  const [done, setDone] = useState(false);

  return (
    <div className="w-full flex justify-center py-5 pt-16 md:pt-5">
      <Tags title="Privacy Policy" />
      <div className="container px-5">
        <h1 className="text-7xl md:text-8xl font-bold pb-2">PRIVACY POLICY</h1>
        <hr className="mb-5 mt-2 md:hidden" />

        {questions.map((item, i) => {
          return (
            <div
              className="bg-sky border border-paper mb-5 lg:flex-row p-5 shadow-lg shadow-neutral-800/20"
              key={i}
            >
              <p className="text-3xl pb-2">{item.q}</p>
              <hr />
              <p className="pt-3">{item.a}</p>
            </div>
          );
        })}
        <hr />
        {done ? (
          <div className="text-lg pt-4">Form submitted, thank you.</div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await submit({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value,
                datset: document.getElementById("dataset").value,
                sampleID: document.getElementById("sampleID").value,
                website: document.getElementById("website").value,
              });
              setDone(true);
            }}
          >
            <div
              className="w-full
                          child:flex child:mt-4
                          child:child:grow child:child:flex child:child:flex-col"
            >
              <div>
                <div className="pr-5">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="message">Explanation</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Message"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="pr-5">
                  <label htmlFor="dataset">Dataset</label>
                  <input
                    type="text"
                    id="dataset"
                    name="dataset"
                    placeholder="Dataset"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sampleID">Sample ID</label>
                  <input
                    type="text"
                    id="sampleID"
                    name="sampleID"
                    placeholder="Sample ID"
                    required
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="website">Website/URL</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="Website/URL"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="py-1 px-4 bg-paper text-sky hover:brightness-90 transition-all"
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
