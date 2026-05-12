## 2026-05-12 - [Prevent Interval Churn]
**Learning:** In the timer implementation, placing the rapidly updating state variable 'timeLeft' in the useEffect dependency array along with 'setInterval' causes the interval to be destroyed and recreated every second.
**Action:** Use functional state updates ('prev => prev - 1') and separate phase transition logic into a different useEffect to prevent interval churn and stabilize the continuous ticking logic.
