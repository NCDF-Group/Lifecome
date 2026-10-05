"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Users,
  Lock,
  CheckCircle2,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Dna,
  Plus,
  Trash2,
  KeyRound,
  ShieldAlert,
  FileCheck,
  Save,
  Building2,
  X,
} from "lucide-react";
import StatusChip from "@/components/ui/StatusChip";
import { usePatientProfile } from "@/components/dashboard/patient-provider";
import { patientEmail, patientField, patientInitials, patientName } from "@/lib/patient/profile";

type TabType = "demographics" | "hmo" | "dependants" | "security";

interface Dependant {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  gender: string;
  status: "Covered" | "Approved" | "Pending";
}

interface DemographicsFormData {
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  genotype: string;
  address: string;
  phone: string;
  email: string;
}

export default function PatientProfilePage() {
  const { profile, loading, error } = usePatientProfile();
  const [activeTab, setActiveTab] = useState<TabType>("demographics");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ---------- TAB 1: DEMOGRAPHICS STATE ----------
  const [formOverrides, setFormOverrides] = useState<Partial<DemographicsFormData>>({});
  const formData: DemographicsFormData = {
    fullName: patientName(profile) === "Patient" ? "" : patientName(profile),
    dob: patientField(profile, "dateOfBirth", "dob", "birthDate"),
    gender: patientField(profile, "gender"),
    bloodGroup: patientField(profile, "bloodGroup", "blood_group"),
    genotype: patientField(profile, "genotype"),
    address: patientField(profile, "address"),
    phone: patientField(profile, "phoneNumber", "phone"),
    email: patientEmail(profile),
    ...formOverrides,
  };
  const updateFormField = (field: keyof DemographicsFormData, value: string) => {
    setFormOverrides((overrides) => ({ ...overrides, [field]: value }));
  };

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // ---------- TAB 2: HMO STATE ----------
  const [linkedPayers, setLinkedPayers] = useState<
    { id: string; name: string; policyId: string; type: string; plan: string; status: string }[]
  >([]);
  const [selectedHmo, setSelectedHmo] = useState("Reliance Health");
  const [memberIdInput, setMemberIdInput] = useState("");

  const handleLinkHmo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdInput.trim()) return;
    setLinkedPayers([
      ...linkedPayers,
      {
        id: Date.now().toString(),
        name: selectedHmo,
        policyId: memberIdInput,
        type: "Secondary",
        plan: "Standard Plan",
        status: "Pending",
      },
    ]);
    setMemberIdInput("");
  };

  // ---------- TAB 3: DEPENDANTS STATE ----------
  const [dependants, setDependants] = useState<Dependant[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newDep, setNewDep] = useState({ name: "", relationship: "Child", dob: "", gender: "Male" });

  const handleAddDependant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDep.name.trim()) return;
    setDependants([
      ...dependants,
      {
        id: `dep-${Date.now()}`,
        name: newDep.name,
        relationship: newDep.relationship,
        dob: newDep.dob || "2024-01-01",
        gender: newDep.gender,
        status: "Pending",
      },
    ]);
    setNewDep({ name: "", relationship: "Child", dob: "", gender: "Male" });
    setModalOpen(false);
  };

  const handleRemoveDependant = (id: string) => {
    setDependants(dependants.filter((d) => d.id !== id));
  };

  // ---------- TAB 4: SECURITY STATE ----------
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [consentGranted, setConsentGranted] = useState(true);

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0667B8] text-white font-extrabold text-xl shadow-md">
            {loading ? "…" : patientInitials(profile)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {loading ? "Loading profile…" : patientName(profile)}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">{patientEmail(profile)}</p>
          </div>
        </div>
      </div>
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* Interactive Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-2xl px-3 pt-2 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("demographics")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "demographics"
              ? "border-[#0667B8] text-[#0667B8]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="size-4" />
          Personal Info (Demographics)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hmo")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "hmo"
              ? "border-[#0667B8] text-[#0667B8]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shield className="size-4" />
          HMO & Coverage
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dependants")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "dependants"
              ? "border-[#0667B8] text-[#0667B8]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="size-4" />
          Dependants ({dependants.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "security"
              ? "border-[#0667B8] text-[#0667B8]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Lock className="size-4" />
          Security & Consent
        </button>
      </div>

      {/* Saved Success Banner */}
      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-[#45AF03] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="size-5 text-[#45AF03]" />
          <span>Patient profile demographics updated successfully!</span>
        </div>
      )}

      {/* ---------------- TAB 1: DEMOGRAPHICS ---------------- */}
      {activeTab === "demographics" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Personal Demographics & Contact</h2>
            <p className="text-xs text-slate-500">Update official patient records and contact details</p>
          </div>

          <form onSubmit={handleDemographicsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormField("fullName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateFormField("dob", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20"
                    required
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Blood Group
                </label>
                <div className="relative">
                  <Heart className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => updateFormField("bloodGroup", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Genotype */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Genotype
                </label>
                <div className="relative">
                  <Dna className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <select
                    value={formData.genotype}
                    onChange={(e) => updateFormField("genotype", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20 bg-white"
                  >
                    <option value="AA">AA</option>
                    <option value="AS">AS</option>
                    <option value="SS">SS</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
              </div>

              {/* Phone Number with Verified Badge */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#45AF03] border border-emerald-200">
                    <CheckCircle2 className="size-3" />
                    Verified Badge
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormField("phone", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20"
                    required
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => updateFormField("address", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0667B8] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
              >
                <Save className="size-4" />
                Save Demographics
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------- TAB 2: HMO & COVERAGE ---------------- */}
      {activeTab === "hmo" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            No payer coverage information is available for this account yet.
          </div>

          {/* Form to link/update alternative participating HMOs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Link Participating HMO Payer</h3>
            <p className="text-xs text-slate-500 mb-6">Add secondary or corporate HMO coverage to your account</p>

            <form onSubmit={handleLinkHmo} className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Participating HMO
                </label>
                <select
                  value={selectedHmo}
                  onChange={(e) => setSelectedHmo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20 bg-white"
                >
                  <option value="Reliance Health">Reliance Health</option>
                  <option value="Hygeia HMO">Hygeia HMO</option>
                  <option value="AXA Mansard Health">AXA Mansard Health</option>
                  <option value="Leadway Health">Leadway Health</option>
                  <option value="Total Health Trust">Total Health Trust</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  HMO Member / Policy ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. RL-992019-B"
                  value={memberIdInput}
                  onChange={(e) => setMemberIdInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0667B8] focus:outline-none focus:ring-2 focus:ring-[#0667B8]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0667B8] px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
                >
                  <Plus className="size-4" />
                  Link Payer
                </button>
              </div>
            </form>

            {/* Linked Payers List */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Linked Participating Payers</h4>
              <div className="space-y-3">
                {linkedPayers.map((payer) => (
                  <div
                    key={payer.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/60 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0667B8]">
                        <Building2 className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{payer.name}</p>
                        <p className="text-xs text-slate-500 font-mono">
                          ID: {payer.policyId} • {payer.type} Payer
                        </p>
                      </div>
                    </div>
                    <StatusChip status={payer.status} />
                  </div>
                ))}
                {linkedPayers.length === 0 && (
                  <p className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    No linked payers are available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: DEPENDANTS ---------------- */}
      {activeTab === "dependants" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Family Dependants</h2>
              <p className="text-xs text-slate-500">Manage family members linked to your health coverage</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0667B8] px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="size-4" />
              Add Dependant
            </button>
          </div>

          {/* List of added family members */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dependants.map((dep) => (
              <div
                key={dep.id}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs transition hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-[#0667B8] font-bold text-sm">
                      {dep.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <StatusChip status={dep.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{dep.name}</h3>
                  <p className="text-xs font-semibold text-[#0667B8] mt-0.5">
                    {dep.relationship} • {dep.gender}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">DOB: {dep.dob}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveDependant(dep.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {dependants.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No dependants are listed for this account.
              </p>
            )}
          </div>

          {/* Add Dependant Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Add New Dependant</h3>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleAddDependant} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Doe"
                      value={newDep.name}
                      onChange={(e) => setNewDep({ ...newDep, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0667B8] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Relationship
                    </label>
                    <select
                      value={newDep.relationship}
                      onChange={(e) => setNewDep({ ...newDep, relationship: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 bg-white"
                    >
                      <option value="Child">Child</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Other Dependant">Other Dependant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newDep.dob}
                      onChange={(e) => setNewDep({ ...newDep, dob: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-bold text-white bg-[#0667B8] rounded-xl hover:bg-blue-700 shadow-xs"
                    >
                      Save Dependant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 4: SECURITY & CONSENT ---------------- */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* MFA Status Indicator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-[#45AF03]">
                  <KeyRound className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Multi-Factor Authentication (MFA)</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#45AF03] border border-emerald-200">
                      <CheckCircle2 className="size-3" />
                      MFA Enabled
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Protects your clinical health records using SMS OTP and Authenticator app verifications
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mfaEnabled
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    : "bg-[#0667B8] text-white hover:bg-blue-700 shadow-md"
                }`}
              >
                {mfaEnabled ? "Reconfigure MFA" : "Enable MFA"}
              </button>
            </div>
          </div>

          {/* Versioned Clinical Data Sharing Consent */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#0667B8]">
                  <FileCheck className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Clinical Data Sharing Consent</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#0667B8] border border-blue-200">
                      Version v1.2 Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Last authorized: October 2, 2026 • Valid for active consultations & referrals
                  </p>
                </div>
              </div>

              <StatusChip status={consentGranted ? "Approved" : "Pending"}>
                {consentGranted ? "Consent Granted (v1.2)" : "Consent Revoked"}
              </StatusChip>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              By maintaining active Clinical Data Sharing Consent (v1.2), you grant explicit permission to verified
              LifeCome Live medical professionals, laboratory partners, and your primary HMO provider to access your
              anonymized and longitudinal diagnostic records strictly for treatment and pre-authorization purposes.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConsentGranted(!consentGranted)}
                className="text-xs font-bold text-[#0667B8] hover:underline cursor-pointer"
              >
                {consentGranted ? "Revoke / Update Consent Options" : "Re-grant Clinical Consent"}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <ShieldAlert className="size-3.5 text-slate-500" />
                Download Signed Consent PDF (v1.2)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
