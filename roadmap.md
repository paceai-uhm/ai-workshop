# Roadmap

## What this is
I am the instructor and I am doing this as an example for my students.
A task list website: people sign in, add tasks, and their tasks are still
there when they come back. Mine is bilingual: each task carries an English
and a Japanese title, and a quiz mode shows titles in a randomly chosen
language to test me.

## What Done means
A stranger opens the site, creates an account with an email and password,
and lands on a task list that belongs only to them. They add tasks, each
with an English title and an optional Japanese title and an optional due
date. Tasks sort into Overdue, Due today, and Later, and checking one off
moves it to Completed. They close the browser, come back the next day, log
in, and every task is exactly as they left it. A "Quiz me" toggle
re-renders the list with each task's title shown in a randomly chosen
language, and a "Show answer" control on any row reveals the other
language. "Remind" means these on-page sections, not push notifications.

## Slices

1. Accounts | done-criteria:
   (a) In a private window, go to /signup, enter a new email and password,
       submit; the browser lands on /tasks and the header shows that email.
   (b) Click "Log out"; the browser lands on /login, and typing /tasks in
       the address bar lands back on /login, not on a task list.
   (c) On /login, enter that email with a wrong password; the page stays on
       /login and shows visible red text naming the failure.
   (d) Log in correctly, close the tab, reopen the site URL; /tasks opens
       without asking for a password again.
   | status: DONE

2. Tasks that persist | done-criteria:
   (a) On /tasks, type "Buy milk" and submit; "Buy milk" appears in the list
       and the input goes empty, with no full page reload.
   (b) Press reload; "Buy milk" is still in the list.
   (c) Click its checkbox; it moves under a "Completed" heading with its
       text struck through, and stays there after a reload.
   (d) In a second private window, sign up as a different email; that
       account's list shows zero tasks and "Buy milk" is nowhere on the page.
   | status: DONE

3. Japanese and quiz mode | done-criteria:
   (a) Add a task with English title "Buy milk", Japanese title
       "牛乳を買う", due today; the row shows "Buy milk" with "牛乳を買う"
       beneath it, under a "Due today" heading.
   (b) Add a second task dated yesterday; it appears under an "Overdue"
       heading above "Due today", with its date text in red.
   (c) Toggle "Quiz me" off and on five times; across those renders at least
       one task title displays as Japanese only and at least one displays as
       English only.
   (d) With quiz mode on, click "Show answer" on a Japanese-only row; the
       English title appears in that same row without the page navigating.
   | status: DONE

## Workshop demo site

A second thing living in the same repo: a set of teaching pages at /demos,
each a working example of one capability a website can have, plus how it was
built and the prompt that would build it again. The audience is non-engineers
who have just built their first static page. The task list above is my own
project; this is the curriculum.

D1. Shared demo chrome and tier 1 | done-criteria:
    (a) /demos lists every demo as a card with its title, one-sentence
        description, tier, and the capabilities it introduces.
    (b) /demos/live-search shows 40 seeded items. Typing narrows the list
        immediately; the web address updates a moment later; copying that
        address into a new tab opens the same filtered view.
    (c) On /demos/live-search, checking nothing in a facet group leaves the
        list unrestricted, and checking boxes in both groups narrows by both.
    (d) /demos/live-data shows today's Honolulu tides from NOAA with a
        visible "last updated" line, and a link that breaks the request on
        purpose so the error panel can be seen; when broken, the rest of the
        page still renders.
    (e) Every demo page shows the same three parts in the same order: the
        working thing, "How this works", "Build it yourself".
    | status: ACTIVE

D2. Tier 2 — database demos (guestbook, upload, account) | status: pending
D3. Tier 3 — realtime, aggregation, AI (live-poll, dashboard, ask)
    | status: pending
    | note: dashboard needs a chart library and ask needs an AI dependency
      plus an API key. Both need a decision before they start.

## Backlog
- Browser push or email notifications, and any background scheduler
- Recurring or repeating tasks
- Editing a task after creation; deleting a task
- Automatic English to Japanese translation (both titles are typed by hand)
- Quiz scoring, streaks, spaced repetition
- Furigana, romaji, kanji difficulty levels
- Projects, tags, categories, priorities
- Sharing a list with another person
- Password reset beyond Supabase's default email; OAuth / Google sign-in
- Dark mode, mobile app, offline support
