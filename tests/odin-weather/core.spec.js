// Valid search shows the expected “current weather” block (city name + temperature + condition text/icon)
// Second search replaces/updates results (search “London” then “Paris” → UI shows Paris, not London)
// Invalid search shows a clear error state/message (and does not show stale previous results as “current”)
// Network/API failure shows error state/message (simulate by intercepting and returning 500 or aborting)
// Units toggle (if you have it): Celsius ↔ Fahrenheit updates displayed temps correctly
// Forecast rendering (if present): forecast list/cards render with the expected count and basic fields (day/time + temp + icon)
// “Feels like / humidity / wind” (if present): each value appears and updates after a new search
// Timestamp/“last updated” (if present): changes after a new search
// Persistence of UI state during interactions:
// After units toggle, a new search still respects the selected unit
// After an error, a valid search returns to normal state (error clears, results show)
