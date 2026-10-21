import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { CareContact } from '../types';
import { useI18n } from '../locales/i18nContext';
import { Pencil } from 'lucide-react';

const emptyContact = {
  name: '', type: '', countyOrTown: '', services: '',
  clinicianName: '', specialty: '', phone: '', hours: '',
  bookingLink: '', mapLink: '', costRange: '', insurance: '',
};

type FormValues = typeof emptyContact;

const safeWebUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch { return undefined; }
};

/** Converts a saved CareContact back into the flat form shape. */
const contactToForm = (c: CareContact): FormValues => ({
  name: c.name,
  type: c.type,
  countyOrTown: c.countyOrTown,
  services: c.services,
  clinicianName: c.clinicianName ?? '',
  specialty: c.specialty ?? '',
  phone: c.phone ?? '',
  hours: c.hours ?? '',
  bookingLink: c.bookingLink ?? '',
  mapLink: c.mapLink ?? '',
  costRange: c.costRange ?? '',
  insurance: c.insurance ?? '',
});

/** Strips trailing whitespace and converts empty optional strings to undefined. */
const cleanForm = (form: FormValues) => ({
  name: form.name.trim(),
  type: form.type.trim(),
  countyOrTown: form.countyOrTown.trim(),
  services: form.services.trim(),
  clinicianName: form.clinicianName.trim() || undefined,
  specialty: form.specialty.trim() || undefined,
  phone: form.phone.trim() || undefined,
  hours: form.hours.trim() || undefined,
  bookingLink: safeWebUrl(form.bookingLink.trim()),
  mapLink: safeWebUrl(form.mapLink.trim()),
  costRange: form.costRange.trim() || undefined,
  insurance: form.insurance.trim() || undefined,
});

export const CareContactsView: React.FC = () => {
  const { t } = useI18n();

  const [contacts, setContacts] = useState<CareContact[]>(() => StorageService.getCareContacts());

  // "Add" form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormValues>(emptyContact);

  // "Edit" form state — keyed by contact id; null means no contact is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormValues>(emptyContact);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const updateAdd = (key: keyof FormValues, value: string) =>
    setAddForm(current => ({ ...current, [key]: value }));

  const updateEdit = (key: keyof FormValues, value: string) =>
    setEditForm(current => ({ ...current, [key]: value }));

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const saved = StorageService.saveCareContact(cleanForm(addForm));
    setContacts(current => [...current, saved]);
    setAddForm(emptyContact);
    setShowAddForm(false);
    showNotice(t.careContacts.saved);
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const startEdit = (contact: CareContact) => {
    setPendingDeleteId(null);   // dismiss any open delete confirm
    setShowAddForm(false);       // close add form if open
    setEditingId(contact.id);
    setEditForm(contactToForm(contact));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyContact);
  };

  const handleUpdate = (event: React.FormEvent, id: string) => {
    event.preventDefault();
    const updated = StorageService.updateCareContact(id, cleanForm(editForm));
    if (updated) {
      setContacts(current => current.map(c => c.id === id ? updated : c));
      showNotice(t.careContacts.updated);
    }
    setEditingId(null);
    setEditForm(emptyContact);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const remove = (id: string) => {
    if (pendingDeleteId !== id) { setPendingDeleteId(id); return; }
    StorageService.deleteCareContact(id);
    setContacts(current => current.filter(contact => contact.id !== id));
    setPendingDeleteId(null);
    if (editingId === id) cancelEdit();
  };

  // ── Shared form renderer ──────────────────────────────────────────────────
  const fields: { key: keyof FormValues; label: string; required?: boolean }[] = [
    { key: 'name', label: t.careContacts.name, required: true },
    { key: 'type', label: t.careContacts.type, required: true },
    { key: 'countyOrTown', label: t.careContacts.location, required: true },
    { key: 'services', label: t.careContacts.services, required: true },
    { key: 'clinicianName', label: t.careContacts.clinician },
    { key: 'specialty', label: t.careContacts.specialty },
    { key: 'phone', label: t.careContacts.phone },
    { key: 'hours', label: t.careContacts.hours },
    { key: 'bookingLink', label: t.careContacts.bookingLink },
    { key: 'mapLink', label: t.careContacts.mapLink },
    { key: 'costRange', label: t.careContacts.cost },
    { key: 'insurance', label: t.careContacts.insurance },
  ];

  const groups = [
    { title: t.careContacts.facilityGroup, fields: fields.slice(0, 4) },
    { title: t.careContacts.professionalGroup, fields: fields.slice(4, 6) },
    { title: t.careContacts.contactGroup, fields: fields.slice(6) },
  ];

  const renderFormFields = (
    formValues: FormValues,
    onChange: (key: keyof FormValues, value: string) => void,
  ) => groups.map(group => (
    <fieldset key={group.title} className="grid grid-cols-1 gap-3 border-t border-stone-200 pt-3 sm:grid-cols-2">
      <legend className="col-span-full text-sm font-semibold text-slate-900">{group.title}</legend>
      {group.fields.map(field => (
        <label key={field.key} className="text-sm font-medium text-slate-800">
          {field.label}{field.required ? ' *' : ''}
          <input
            required={field.required}
            type={field.key === 'bookingLink' || field.key === 'mapLink' ? 'url' : 'text'}
            value={formValues[field.key]}
            onChange={event => onChange(field.key, event.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900"
          />
        </label>
      ))}
    </fieldset>
  ));

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{t.careContacts.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{t.careContacts.description}</p>
      </div>

      {/* ── Add button / form ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => { setShowAddForm(v => !v); setEditingId(null); }}
        className="w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-800 min-h-11"
      >
        {showAddForm ? t.careContacts.cancel : t.careContacts.add}
      </button>

      {notice && (
        <p role="status" aria-live="polite" className="text-sm font-medium text-slate-800">
          {notice}
        </p>
      )}

      {showAddForm && (
        <form onSubmit={handleAdd} className="space-y-4">
          {renderFormFields(addForm, updateAdd)}
          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
          >
            {t.careContacts.save}
          </button>
        </form>
      )}

      {/* ── Contact list ─────────────────────────────────────────────────── */}
      {contacts.length === 0
        ? <p className="rounded-xl bg-stone-50 p-4 text-sm text-slate-700">{t.careContacts.noContacts}</p>
        : (
          <ul className="space-y-3">
            {contacts.map(contact => (
              <li key={contact.id} className="rounded-2xl border border-stone-200 text-sm">

                {/* Card header — always visible */}
                <div className="flex items-start justify-between gap-2 p-4">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{contact.name}</h4>
                    <p className="text-sm text-slate-700">{contact.type} · {contact.countyOrTown}</p>
                  </div>

                  {/* Edit / Remove actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {editingId !== contact.id && (
                      <button
                        type="button"
                        aria-label={`${t.careContacts.edit}: ${contact.name}`}
                        onClick={() => startEdit(contact)}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-brand-50 hover:text-brand-800 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(contact.id)}
                      className="min-h-11 rounded-lg px-3 text-sm font-semibold text-rose-900 underline"
                    >
                      {pendingDeleteId === contact.id ? t.careContacts.confirmRemove : t.careContacts.remove}
                    </button>
                  </div>
                </div>

                {/* Delete confirm */}
                {pendingDeleteId === contact.id && (
                  <div
                    className="mx-4 mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3"
                    role="alertdialog"
                    aria-label={t.careContacts.removalPrompt}
                    aria-describedby={`remove-prompt-${contact.id}`}
                  >
                    <p id={`remove-prompt-${contact.id}`} className="text-sm text-rose-950">
                      {t.careContacts.removalPrompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="mt-2 min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-800 underline"
                    >
                      {t.careContacts.cancel}
                    </button>
                  </div>
                )}

                {/* Inline edit form */}
                {editingId === contact.id
                  ? (
                    <form
                      onSubmit={event => handleUpdate(event, contact.id)}
                      className="border-t border-stone-200 px-4 pb-4 pt-3 space-y-4"
                      aria-label={t.careContacts.editContact}
                    >
                      {renderFormFields(editForm, updateEdit)}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="min-h-11 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-stone-50"
                        >
                          {t.careContacts.cancel}
                        </button>
                        <button
                          type="submit"
                          className="min-h-11 flex-1 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
                        >
                          {t.careContacts.save}
                        </button>
                      </div>
                    </form>
                  )
                  : (
                    /* Read-only contact details */
                    <div className="border-t border-stone-100 px-4 pb-4 pt-3 space-y-0.5">
                      <p className="text-slate-700">{contact.services}</p>
                      {[
                        contact.clinicianName && `${t.careContacts.clinician}: ${contact.clinicianName}`,
                        contact.specialty    && `${t.careContacts.specialty}: ${contact.specialty}`,
                        contact.phone        && `${t.careContacts.phone}: ${contact.phone}`,
                        contact.hours        && `${t.careContacts.hours}: ${contact.hours}`,
                        contact.costRange    && `${t.careContacts.cost}: ${contact.costRange}`,
                        contact.insurance    && `${t.careContacts.insurance}: ${contact.insurance}`,
                      ]
                        .filter((line): line is string => Boolean(line))
                        .map(line => <p key={line} className="text-slate-600">{line}</p>)
                      }
                      {safeWebUrl(contact.bookingLink) && (
                        <a href={safeWebUrl(contact.bookingLink)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-brand-700 underline">
                          {t.careContacts.openBooking}
                        </a>
                      )}
                      {safeWebUrl(contact.mapLink) && (
                        <a href={safeWebUrl(contact.mapLink)} target="_blank" rel="noreferrer" className="ml-3 mt-1 inline-block text-brand-700 underline">
                          {t.careContacts.openMap}
                        </a>
                      )}
                    </div>
                  )
                }
              </li>
            ))}
          </ul>
        )
      }
    </section>
  );
};
