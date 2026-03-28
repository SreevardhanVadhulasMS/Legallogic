# Expense Tracker Fix - Server Error on Save
Step-by-step plan to resolve "Failed to save expense: Server error"

## Current Status - REVERTED
- [x] Original db.js/server.js restored (auth working)
- [ ] Root cause: Expense.save() failing silently (likely schema/date validation or userId type)
- [ ] Next: Add logging to expense POST only (no DB changes)

- [ ] Test: Restart server, add expense, check console/DB
- [ ] Verify: List expenses, stats, CRUD operations

## Next Action
Complete database connection fixes, then test.
