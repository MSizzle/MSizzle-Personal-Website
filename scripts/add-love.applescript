-- "Add to Things I Love" desktop app.
--
-- Double-click the compiled .app on the Desktop, paste a URL, and it:
--   1. creates a draft (unpublished) row in the Things I Love Notion DB,
--   2. runs URL-first enrichment on it (auto Name / Type / cover / subtitle / note),
--   3. refreshes the live site,
--   4. shows a native notification with the result.
--
-- Rebuild after editing:
--   osacompile -o ~/Desktop/"Add to Things I Love.app" scripts/add-love.applescript
--
-- `do shell script` runs with a minimal PATH, so we prepend Homebrew's bin (where
-- node/npx live) and pipe through `tail -n1` so only add-love.ts's final status
-- line reaches the notification (and so a nonzero exit never masks the message).

on run
	set projectDir to "/Users/Montster/MSizzle Personal Website"

	try
		set resp to display dialog "Paste a URL to add to Things I Love:" default answer "" with title "Add to Things I Love" buttons {"Cancel", "Add"} default button "Add" with icon note
	on error number -128
		return
	end try

	set theURL to text returned of resp
	if theURL is "" then
		display notification "No URL entered." with title "Things I Love"
		return
	end if

	display notification "Adding and enriching..." with title "Things I Love" subtitle theURL

	set shellCmd to "export PATH=\"/opt/homebrew/bin:$PATH\"; cd " & quoted form of projectDir & " && npx tsx scripts/add-love.ts " & quoted form of theURL & " 2>/dev/null | tail -n1"

	try
		set theResult to do shell script shellCmd
	on error errMsg
		display notification "Something went wrong. See Terminal for details." with title "Things I Love" subtitle "Failed"
		return
	end try

	if theResult is "" then set theResult to "Done."
	display notification theResult with title "Things I Love"
end run
