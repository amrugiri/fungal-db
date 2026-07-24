"use client";

import { SectionHeading } from "@/components/ui/headings";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Species = {
  id: string;
  slug: string;
  scientificName: string;
  genus: string;
  verificationStatus: string;
  ncbiTaxonomyId: string | null;
};

export function AdminPanel() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [species, setSpecies] = useState<Species[]>([]);
  const [error, setError] = useState("");
  const [doiInput, setDoiInput] = useState("");
  const [doiResult, setDoiResult] = useState<string>("");
  const [taxName, setTaxName] = useState("");
  const [taxResult, setTaxResult] = useState<string>("");
  const [newSpecies, setNewSpecies] = useState({
    genus: "",
    speciesEpithet: "",
    scientificName: "",
    slug: "",
    commonNames: "",
    ncbiTaxonomyId: "",
  });

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadSpecies();
    } else {
      setError("Invalid password");
    }
  }

  async function loadSpecies() {
    const res = await fetch("/api/species");
    if (res.ok) {
      setSpecies(await res.json());
    }
  }

  async function lookupDoi() {
    const res = await fetch(`/api/citations/lookup?doi=${encodeURIComponent(doiInput)}`);
    const data = await res.json();
    setDoiResult(res.ok ? JSON.stringify(data, null, 2) : data.error);
  }

  async function lookupTaxonomy() {
    const res = await fetch(`/api/taxonomy/lookup?name=${encodeURIComponent(taxName)}`);
    const data = await res.json();
    if (res.ok) {
      setTaxResult(JSON.stringify(data, null, 2));
      setNewSpecies((s) => ({
        ...s,
        ncbiTaxonomyId: data.taxId,
        genus: data.taxonomy?.genus ?? s.genus,
        scientificName: data.scientificName,
        speciesEpithet: data.scientificName.split(" ").slice(1).join(" "),
        slug: data.scientificName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, ""),
      }));
    } else {
      setTaxResult(data.error);
    }
  }

  async function createSpecies(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/species", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newSpecies,
        commonNames: newSpecies.commonNames.split(",").map((s) => s.trim()).filter(Boolean),
        taxonomy: { genus: newSpecies.genus },
      }),
    });
    if (res.ok) {
      setNewSpecies({
        genus: "",
        speciesEpithet: "",
        scientificName: "",
        slug: "",
        commonNames: "",
        ncbiTaxonomyId: "",
      });
      loadSpecies();
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/species", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, verificationStatus: status }),
    });
    loadSpecies();
  }

  async function deleteSpecies(id: string) {
    if (!confirm("Delete this species and all related records?")) return;
    await fetch(`/api/species?id=${id}`, { method: "DELETE" });
    loadSpecies();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    router.refresh();
  }

  useEffect(() => {
    fetch("/api/species")
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true);
          return r.json();
        }
        return null;
      })
      .then((data) => {
        if (data) setSpecies(data);
      });
  }, []);

  if (!authenticated) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-4 rounded-lg border bg-white p-6">
        <h1 className="text-xl font-semibold">Admin login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ADMIN_PASSWORD"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded bg-zinc-900 py-2 text-sm text-white">
          Login
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Curation admin</h1>
        <button type="button" onClick={logout} className="text-sm text-black hover:underline">
          Logout
        </button>
      </div>

      <section className="rounded-lg border bg-white p-6">
        <SectionHeading className="mb-4">DOI lookup (OpenAlex)</SectionHeading>
        <div className="flex gap-2">
          <input
            value={doiInput}
            onChange={(e) => setDoiInput(e.target.value)}
            placeholder="10.1016/j.tifs.2018.04.008"
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button type="button" onClick={lookupDoi} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
            Lookup
          </button>
        </div>
        {doiResult && <pre className="mt-3 overflow-auto rounded bg-zinc-50 p-3 text-xs">{doiResult}</pre>}
      </section>

      <section className="rounded-lg border bg-white p-6">
        <SectionHeading className="mb-4">NCBI taxonomy lookup</SectionHeading>
        <div className="flex gap-2">
          <input
            value={taxName}
            onChange={(e) => setTaxName(e.target.value)}
            placeholder="Fusarium venenatum"
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button type="button" onClick={lookupTaxonomy} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
            Lookup
          </button>
        </div>
        {taxResult && <pre className="mt-3 overflow-auto rounded bg-zinc-50 p-3 text-xs">{taxResult}</pre>}
      </section>

      <section className="rounded-lg border bg-white p-6">
        <SectionHeading className="mb-4">Create species</SectionHeading>
        <form onSubmit={createSpecies} className="grid gap-3 sm:grid-cols-2">
          {(["genus", "speciesEpithet", "scientificName", "slug", "commonNames", "ncbiTaxonomyId"] as const).map(
            (field) => (
              <input
                key={field}
                value={newSpecies[field]}
                onChange={(e) => setNewSpecies({ ...newSpecies, [field]: e.target.value })}
                placeholder={field}
                className="rounded border px-3 py-2 text-sm"
              />
            ),
          )}
          <button type="submit" className="rounded bg-green-700 px-4 py-2 text-sm text-white sm:col-span-2">
            Create species (draft)
          </button>
        </form>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <SectionHeading className="mb-4">Species ({species.length})</SectionHeading>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {species.map((s) => (
                <tr key={s.id} className="border-b border-zinc-100">
                  <td className="py-2 pr-4">
                    <em>{s.scientificName}</em>
                  </td>
                  <td className="py-2 pr-4">{s.verificationStatus}</td>
                  <td className="space-x-2 py-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(s.id, "peer_reviewed")}
                      className="text-xs text-blue-700 hover:underline"
                    >
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSpecies(s.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
