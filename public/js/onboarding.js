// used to redirect to chat.js when user clicks on welcome.es submit button
document.getElementById("onboarding-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
    console.log("event called");
    const username = document.getElementById("username").value;
  
    // Send username to the server
    const response = await fetch("/join-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
  
    if (response.ok) {
      window.location.href = `/chat?username=${encodeURIComponent(username)}`;
    } else {
      alert("Failed to join chat. Please try again.");
    }
  });
  