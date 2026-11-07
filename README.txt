SWEET RIVER ESCAPE — LIVE LOTERIA

Deploy the entire unzipped folder to Netlify as a site backed by a Git repository, with Netlify Functions and npm dependencies enabled. A simple static drag-and-drop deploy may not install dependencies or deploy functions correctly; use a Git-connected deploy or Netlify CLI build/deploy.

Netlify site configuration > Environment variables:
ORGANIZER_PASSWORD = your unique strong organizer password
ORGANIZER_SECRET = a separate random secret, at least 32 characters
Set both as secret values, available to Functions. Redeploy after configuring them.

Guest URL: https://YOUR-SITE.netlify.app/
Organizer URL: https://YOUR-SITE.netlify.app/admin

Test with two phones/browsers. Guests join BEFORE organizer presses Start game. Organizer login, Start game, Draw next card. Guests see called-card updates every 4 seconds and can only mark called cards. Boards are saved server-side and recover on the same browser through a local board ID.

Important limitations:
- This is a prototype for a small event, not a professionally audited production system.
- It relies on Netlify Blobs; simultaneous caller clicks are not transactionally locked. Use ONE organizer device and avoid rapid double clicks.
- Anyone with a board ID can access that board; IDs are random and hard to guess, but this is not guest authentication.
- There is no centralized winner-claim review dashboard. Verify a winning board with the guest in person.
- Guest board creation is closed when game starts, but guests may still join after an organizer reset.
- Existing boards survive a reset and can be used again. For a new event, deploy a new site or clear the Netlify Blobs store.
- Do not share organizer password or admin URL publicly. The admin URL alone does not grant access.
