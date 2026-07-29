document.addEventListener('DOMContentLoaded', function() {
    const restoreButtons = document.querySelectorAll('.restore'); //get all remove buttons


    restoreButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const archiveId = this.id;
            
            console.log(archiveId);

            try {
                // GET the exact data for this task from the archive Tasks table
                const response = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Archived_Tasks?id=eq.${archiveId}`, {
                    method: 'GET',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                    }
                });
                if (!response.ok)
                {
                    const errorMessage = await response.text();
                    throw new Error(`Failed to get archive (${response.status}): ${errorMessage}`);
                }
                const data = await response.json()
                console.log(data);
                // Supabase returns an array, so we grab the first item [0]
                const archiveData = data[0];

                // Remove the old ID so the Archive table can generate its own fresh ID
                delete archiveData.id;
                delete archiveData.archived_at;

                // POST the data into the tasks table
                const postresponse = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Tasks`, {
                    method: 'POST',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(archiveData)
                });
                if (!postresponse.ok)
                {
                    const errorMessage = await postresponse.text();
                    throw new Error(`Failed to copy to Tasks (${postresponse.status}): ${errorMessage}`);
                }
                // DELETE the archive from the archive table
                const deleteResponse = await fetch(`https://szxaarjqdvgbsmmmernl.supabase.co/rest/v1/Archived_Tasks?id=eq.${archiveId}`, {
                    method: 'DELETE',
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGFhcmpxZHZnYnNtbW1lcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTM5NzUsImV4cCI6MjA5MzQ4OTk3NX0.gZokTd52piQIsrr_NpgPgqB_PPt0PguuPwSggYMoyc8",
                        "Prefer": "return=representation" // 👈 Add this line
                    }
                });
                const deletedData = await deleteResponse.json();
                console.log("Deleted item from database:", deletedData);
                if (!deleteResponse.ok)
                {
                    const errorMessage = await deleteResponse.text();
                    throw new Error(`Failed to delete task (${deleteResponse.status}): ${errorMessage}`);
                }

                button.parentElement.remove();
            } catch (error)
            {
                console.error("Error restoring task: ",error)
            }
        });
    });

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

            if (statusText === "Now")
            {
                element.textContent = `Archived just a bit ago`;
            }
            else
            {
                element.textContent = `Archived ${statusText} ago`;
            }
        });
    }

    // Run it immediately when the page loads
    updateCountdowns();

    // Refresh the countdowns every 60 seconds so the time stays accurate
    setInterval(updateCountdowns, 60000);
});
