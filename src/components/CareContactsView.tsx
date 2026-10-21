import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { CareContact } from '../types';
import { useI18n } from '../locales/i18nContext';

const emptyContact = { name: '', type: '', countyOrTown: '', services: '', clinicianName: '', specialty: '', phone: '', hours: '', bookingLink: '', mapLink: '', costRange: '', insurance: '' };
const safeWebUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch { return undefined; }
};

export const CareContactsView: React.FC = () => {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<CareContact[]>(() => StorageService.getCareContacts());
  const [form, setForm] = useState(emptyContact);
  const [showForm, setShowForm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const update = (key: keyof typeof emptyContact, value: string) => setForm(current => ({ ...current, [key]: value }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const saved = StorageService.saveCareContact({
      ...form,
      name: form.name.trim(), type: form.type.trim(), countyOrTown: form.countyOrTown.trim(), services: form.services.trim(),
      clinicianName: form.clinicianName.trim() || undefined, specialty: form.specialty.trim() || undefined,
      phone: form.phone.trim() || undefined, hours: form.hours.trim() || undefined,
      bookingLink: safeWebUrl(form.bookingLink.trim()), mapLink: safeWebUrl(form.mapLink.trim()), costRange: form.costRange.trim() || undefined,
      insurance: form.insurance.trim() || undefined,
    });
    setContacts(current => [...current, saved]);
    setForm(emptyContact);
    setShowForm(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  const remove = (id: string) => {
    if (pendingDeleteId !== id) { setPendingDeleteId(id); return; }
    StorageService.deleteCareContact(id);
    setContacts(current => current.filter(contact => contact.id !== id));
    setPendingDeleteId(null);
  };

  const fields: { key: keyof typeof emptyContact; label: string; required?: boolean }[] = [
    { key: 'name', label: t.careContacts.name, required: true }, { key: 'type', label: t.careContacts.type, required: true },
    { key: 'countyOrTown', label: t.careContacts.location, required: true }, { key: 'services', label: t.careContacts.services, required: true },
    { key: 'clinicianName', label: t.careContacts.clinician }, { key: 'specialty', label: t.careContacts.specialty },
    { key: 'phone', label: t.careContacts.phone }, { key: 'hours', label: t.careContacts.hours }, { key: 'bookingLink', label: t.careContacts.bookingLink }, { key: 'mapLink', label: t.careContacts.mapLink },
    { key: 'costRange', label: t.careContacts.cost }, { key: 'insurance', label: t.careContacts.insurance },
  ];
  const groups = [
    { title: t.careContacts.facilityGroup, fields: fields.slice(0, 4) },
    { title: t.careContacts.professionalGroup, fields: fields.slice(4, 6) },
    { title: t.careContacts.contactGroup, fields: fields.slice(6) },
  ];

  return <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
    <div>
      <h3 className="text-sm font-bold text-slate-900">{t.careContacts.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{t.careContacts.description}</p>
    </div>
    <button type="button" onClick={() => setShowForm(value => !value)} className="w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-800">{showForm ? t.careContacts.cancel : t.careContacts.add}</button>
    {savedNotice && <p role="status" aria-live="polite" className="text-sm font-medium text-slate-800">{t.careContacts.saved}</p>}
    {showForm && <form onSubmit={save} className="space-y-4">
      {groups.map(group => <fieldset key={group.title} className="grid grid-cols-1 gap-3 border-t border-stone-200 pt-3 sm:grid-cols-2">
        <legend className="col-span-full text-sm font-semibold text-slate-900">{group.title}</legend>
        {group.fields.map(field => <label key={field.key} className="text-sm font-medium text-slate-800">{field.label}{field.required ? ' *' : ''}
          <input required={field.required} type={field.key === 'bookingLink' || field.key === 'mapLink' ? 'url' : 'text'} value={form[field.key]} onChange={event => update(field.key, event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900" />
        </label>)}
      </fieldset>)}
      <button type="submit" className="min-h-12 w-full rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900">{t.careContacts.save}</button>
    </form>}
    {contacts.length === 0 ? <p className="rounded-xl bg-stone-50 p-4 text-sm text-slate-700">{t.careContacts.noContacts}</p> : <ul className="space-y-3">{contacts.map(contact => <li key={contact.id} className="rounded-2xl border border-stone-200 p-4 text-sm">
      <div className="flex items-start justify-between gap-2"><div><h4 className="text-base font-semibold text-slate-900">{contact.name}</h4><p className="text-sm text-slate-700">{contact.type} · {contact.countyOrTown}</p></div><button type="button" onClick={() => remove(contact.id)} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-rose-900 underline">{pendingDeleteId === contact.id ? t.careContacts.confirmRemove : t.careContacts.remove}</button></div>
      {pendingDeleteId === contact.id && <div className="mt-2 rounded-xl border border-rose-300 bg-rose-50 p-3" role="alertdialog" aria-label={t.careContacts.removalPrompt}><p className="text-sm text-rose-950">{t.careContacts.removalPrompt}</p><button type="button" onClick={() => setPendingDeleteId(null)} className="mt-2 min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-800 underline">{t.careContacts.cancel}</button></div>}
      <p className="mt-1 text-slate-700">{contact.services}</p>
      {[
        contact.clinicianName && `${t.careContacts.clinician}: ${contact.clinicianName}`,
        contact.specialty && `${t.careContacts.specialty}: ${contact.specialty}`,
        contact.phone && `${t.careContacts.phone}: ${contact.phone}`,
        contact.hours && `${t.careContacts.hours}: ${contact.hours}`,
        contact.costRange && `${t.careContacts.cost}: ${contact.costRange}`,
        contact.insurance && `${t.careContacts.insurance}: ${contact.insurance}`,
      ].filter((line): line is string => Boolean(line)).map(line => <p key={line} className="mt-0.5 text-slate-600">{line}</p>)}
      {safeWebUrl(contact.bookingLink) && <a href={safeWebUrl(contact.bookingLink)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-brand-700 underline">{t.careContacts.openBooking}</a>}
      {safeWebUrl(contact.mapLink) && <a href={safeWebUrl(contact.mapLink)} target="_blank" rel="noreferrer" className="ml-3 mt-1 inline-block text-brand-700 underline">{t.careContacts.openMap}</a>}
    </li>)}</ul>}
  </section>;
};
