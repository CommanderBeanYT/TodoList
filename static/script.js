document.addEventListener('DOMContentLoaded', function() {
    const checkButtons = document.querySelectorAll('.checkbox'); //get all checkboxes
    const removeButtons = document.querySelectorAll('.remove'); //get all remove buttons

    checkButtons.forEach(checkbox => {
        checkbox.addEventListener('change', function(event) {
            // once user toggles a checkbox update the database
            fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Tasks?id=eq.${this.id}`, {
                method: 'PATCH',
                headers: {
                    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    completed: this.checked
                })
            })
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const taskId = this.id;
            
            console.log(taskId);

            try {
                // GET the exact data for this task from the Tasks table
                const response = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Tasks?id=eq.${taskId}`, {
                    method: 'GET',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                    }
                });
                if (!response.ok)
                {
                    const errorMessage = await response.text();
                    throw new Error(`Failed to get task (${response.status}): ${errorMessage}`);
                }
                const data = await response.json()
                console.log(data);
                // Supabase returns an array, so we grab the first item [0]
                const taskData = data[0];

                // Remove the old ID so the task table can generate its own fresh ID
                delete taskData.id;

                // POST the data into the tasks table
                const postresponse = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Archived_Tasks`, {
                    method: 'POST',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(taskData)
                });
                if (!postresponse.ok)
                {
                    const errorMessage = await postresponse.text();
                    throw new Error(`Failed to copy to archive (${postresponse.status}): ${errorMessage}`);
                }
                // DELETE the task from the task table
                const deleteResponse = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Tasks?id=eq.${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8"
                    }
                });
                if (!deleteResponse.ok)
                {
                    const errorMessage = await deleteResponse.text();
                    throw new Error(`Failed to delete task (${deleteResponse.status}): ${errorMessage}`);
                }

                button.parentElement.remove();
            } catch (error)
            {
                console.error("Error archiving task: ",error)
            }
        });
    });

    // --- TIMEZONE SUBMISSION FIX ---
    const form = document.getElementById("new-task");
    if (form) {
        form.addEventListener("submit", function(event) {
            const dateInput = document.getElementById("due-date");
            const hiddenInput = document.getElementById("real-due-date");

            if (dateInput.value) {
                // Convert the local time into an exact global ISO string (UTC)
                const localDate = new Date(dateInput.value);
                hiddenInput.value = localDate.toISOString();
            } else {
                // If they left the date blank, ensure the hidden field is empty
                hiddenInput.value = "";
            }
        });
    }

    function updateCountdowns() {
        const now = new Date(); // Device time

        document.querySelectorAll(".countdown").forEach(element => {
            let dueDateString = element.getAttribute("data-due");
            if (!dueDateString) return;

            // If Supabase didn't append a timezone offset, force it to be treated as UTC
            if (!dueDateString.includes("Z") && !dueDateString.includes("+") && !dueDateString.includes("-")) {
                dueDateString += "Z";
            }

            const dueDate = new Date(dueDateString);
            const differenceInMs = dueDate - now;

            const isOverdue = differenceInMs < 0;
            const absoluteDiff = Math.abs(differenceInMs);

            const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));

            let statusText = "";
            if (days > 0) {
                statusText = `${days} day${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                statusText = `${hours} hour${hours > 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                statusText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
            } else
            {
                statusText = "Now";
            }

            if (isOverdue) {
                element.textContent = `${statusText} overdue`;
                element.style.color = "#dc3545"; // Bootstrap danger red
            }
            else if (statusText === "Now")
            {
                element.textContent = `Due ${statusText}!`;
                element.style.color = "";
            }
            else
            {
                element.textContent = `Due in ${statusText}`;
                element.style.color = "";
            }
        });
    }

    // Run it immediately when the page loads
    updateCountdowns();

    // Refresh the countdowns every 60 seconds so the time stays accurate
    setInterval(updateCountdowns, 60000);
});
