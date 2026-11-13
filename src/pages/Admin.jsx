import { useEffect, useMemo, useState } from 'react';
import { Alert, ArrowUpRight } from '../components/Icon.jsx';
import { isEmail } from '../lib/contactSchema.js';
import { getSupabase } from '../lib/supabaseClient.js';

// /admin: the studio's private enquiries inbox. Sign in with a Supabase user
// that is listed in public.admins (see supabase/migrations). Not linked from the
// site, not in the sitemap, and marked noindex.

const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'replied', label: 'Replied' },
  { id: 'client', label: 'Client' },
  { id: 'closed', label: 'Closed' },
];

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

// A phone number as a WhatsApp chat link (10-digit numbers are taken as Indian).
const whatsappLink = (contact) => {
  const digits = contact.replace(/\D/g, '');
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};

function Notice({ title, children }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-7 md:p-10">
      <h2 className="type-h3">{title}</h2>
      <div className="mt-4 max-w-xl space-y-3 text-muted">{children}</div>
    </div>
  );
}

function SignIn({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) setError(signInError.message || 'Could not sign in.');
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md rounded-3xl border border-line bg-surface p-7 md:p-10">
      <h2 className="type-h3">Sign in</h2>
      <p className="mt-3 text-muted">For the ISOFORM team only.</p>
      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="admin-email" className="field-label">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="field-label">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field-input"
          />
        </div>
      </div>
      {error ? (
        <p role="alert" className="field-error mt-6">
          <Alert size={18} className="mt-0.5 flex-none" />
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-8 w-full" aria-disabled={busy ? 'true' : undefined}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

function EnquiryCard({ enquiry, onStatus, onDelete }) {
  const email = isEmail(enquiry.contact);
  return (
    <li className="rounded-3xl border border-line bg-surface p-6 md:p-8" data-status={enquiry.status}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h3 className="text-xl font-[450] tracking-[-0.02em] md:text-2xl">{enquiry.name}</h3>
          <p className="mt-1 text-sm text-faint">
            {enquiry.business ? `${enquiry.business} · ` : ''}
            <time dateTime={enquiry.created_at}>{formatDate(enquiry.created_at)}</time>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor={`status-${enquiry.id}`}>
            Status of the enquiry from {enquiry.name}
          </label>
          <select
            id={`status-${enquiry.id}`}
            value={enquiry.status}
            onChange={(event) => onStatus(enquiry, event.target.value)}
            className="field-input h-11 w-auto py-0 pr-8 text-[0.9375rem] [&_option]:bg-ink"
          >
            {STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onDelete(enquiry)}
            className="h-11 rounded-full border border-white/20 px-4 text-[0.9375rem] text-muted transition-colors hover:border-danger hover:text-danger"
          >
            Delete<span className="sr-only"> the enquiry from {enquiry.name}</span>
          </button>
        </div>
      </div>

      {enquiry.services?.length ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {enquiry.services.map((service) => (
            <li key={service} className="rounded-full border border-white/15 px-3 py-1 text-sm text-muted">
              {service}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-5 max-w-3xl whitespace-pre-wrap text-fg">{enquiry.message}</p>

      <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
        <span className="tabular-nums text-muted">{enquiry.contact}</span>
        {email ? (
          <a
            className="link-arrow text-[0.9375rem]"
            href={`mailto:${enquiry.contact}?subject=${encodeURIComponent('Your enquiry to ISOFORM')}`}
          >
            Reply by email
          </a>
        ) : (
          <>
            <a
              className="link-arrow text-[0.9375rem]"
              href={whatsappLink(enquiry.contact)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
              <ArrowUpRight size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="link-arrow text-[0.9375rem]" href={`tel:${enquiry.contact.replace(/[^\d+]/g, '')}`}>
              Call
            </a>
          </>
        )}
      </p>
    </li>
  );
}

function Inbox({ supabase, session }) {
  const [enquiries, setEnquiries] = useState(null); // null while loading
  const [filter, setFilter] = useState('new');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: loadError }) => {
        if (!alive) return;
        if (loadError) {
          setError(`Couldn't load enquiries: ${loadError.message}`);
          setEnquiries([]);
        } else {
          setError('');
          setEnquiries(data);
        }
      });
    return () => {
      alive = false;
    };
  }, [supabase, reloadKey]);

  const counts = useMemo(() => {
    const result = { all: enquiries?.length ?? 0 };
    for (const status of STATUSES)
      result[status.id] = enquiries?.filter((item) => item.status === status.id).length ?? 0;
    return result;
  }, [enquiries]);

  const visible = (enquiries ?? []).filter((item) => filter === 'all' || item.status === filter);

  const onStatus = async (enquiry, status) => {
    const previous = enquiry.status;
    setEnquiries((list) => list.map((item) => (item.id === enquiry.id ? { ...item, status } : item)));
    const { error: updateError } = await supabase.from('enquiries').update({ status }).eq('id', enquiry.id);
    if (updateError) {
      setError(`Couldn't change the status: ${updateError.message}`);
      setEnquiries((list) => list.map((item) => (item.id === enquiry.id ? { ...item, status: previous } : item)));
    }
  };

  const onDelete = async (enquiry) => {
    if (!window.confirm(`Delete the enquiry from ${enquiry.name}? This can't be undone.`)) return;
    const { error: deleteError } = await supabase.from('enquiries').delete().eq('id', enquiry.id);
    if (deleteError) setError(`Couldn't delete it: ${deleteError.message}`);
    else setEnquiries((list) => list.filter((item) => item.id !== enquiry.id));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div role="group" aria-label="Show enquiries by status" className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'All' }, ...STATUSES].map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={`h-11 rounded-full border px-5 text-[0.9375rem] transition-colors ${
                  active
                    ? 'border-white bg-white font-medium text-ink'
                    : 'border-white/20 text-muted hover:border-white/50 hover:text-white'
                }`}
              >
                {item.label} <span className="tabular-nums opacity-70">{counts[item.id]}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-5 text-sm text-muted">
          <span className="hidden sm:inline">{session.user.email}</span>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setEnquiries(null);
              setReloadKey((key) => key + 1);
            }}
          >
            Refresh
          </button>
          <button type="button" className="text-link" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="field-error mt-6">
          <Alert size={18} className="mt-0.5 flex-none" />
          {error}
        </p>
      ) : null}

      {enquiries === null ? (
        <p className="mt-10 text-muted" role="status">
          Loading enquiries…
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-muted" role="status">
          {filter === 'all' ? 'No enquiries yet.' : 'Nothing here.'}
        </p>
      ) : (
        <ul className="mt-8 space-y-5" aria-label="Enquiries">
          {visible.map((enquiry) => (
            <EnquiryCard key={enquiry.id} enquiry={enquiry} onStatus={onStatus} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Admin() {
  const [setup, setSetup] = useState('loading'); // loading | ready | unconfigured | error
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(undefined); // undefined until known
  const [access, setAccess] = useState(null); // { userId, ok } once checked

  // Load Supabase (only on this page) and follow the sign-in state.
  useEffect(() => {
    let alive = true;
    let subscription;
    getSupabase()
      .then(async (client) => {
        if (!alive) return;
        if (!client) {
          setSetup('unconfigured');
          return;
        }
        setSupabase(client);
        setSetup('ready');
        subscription = client.auth.onAuthStateChange((_event, next) => {
          if (alive) setSession(next);
        }).data.subscription;
        const { data } = await client.auth.getSession();
        if (alive) setSession(data.session);
      })
      .catch(() => alive && setSetup('error'));
    return () => {
      alive = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Is the signed-in user an admin? (Row-level security only shows a user
  // their own row in public.admins.)
  const userId = session?.user?.id;
  useEffect(() => {
    if (!supabase || !userId) return undefined;
    let alive = true;
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .limit(1)
      .then(({ data, error }) => {
        if (alive) setAccess({ userId, ok: !error && data.length > 0 });
      });
    return () => {
      alive = false;
    };
  }, [supabase, userId]);

  let content;
  if (setup === 'unconfigured') {
    content = (
      <Notice title="Supabase isn’t set up yet">
        <p>
          Add <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> to the environment (see{' '}
          <code>.env.example</code>), then reload.
        </p>
      </Notice>
    );
  } else if (setup === 'error') {
    content = (
      <Notice title="Couldn’t load the admin page">
        <p>Check your connection and reload the page.</p>
      </Notice>
    );
  } else if (setup === 'loading' || session === undefined) {
    content = (
      <p className="text-muted" role="status">
        Loading…
      </p>
    );
  } else if (!session) {
    content = <SignIn supabase={supabase} />;
  } else if (access?.userId !== userId) {
    content = (
      <p className="text-muted" role="status">
        Checking access…
      </p>
    );
  } else if (!access.ok) {
    content = (
      <Notice title="No admin access">
        <p>
          {session.user.email} is signed in, but isn’t on the admin list. Ask the site owner to add you, or sign in with
          another account.
        </p>
        <button type="button" className="btn btn-secondary mt-4" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </Notice>
    );
  } else {
    content = <Inbox supabase={supabase} session={session} />;
  }

  return (
    <section className="wrap pb-24 pt-32 md:pb-32 md:pt-40" aria-labelledby="admin-title">
      <p className="label-caps text-brand-300">Admin</p>
      <h1 id="admin-title" className="type-h2 mt-5">
        Enquiries
      </h1>
      <div className="mt-10 md:mt-14">{content}</div>
    </section>
  );
}
