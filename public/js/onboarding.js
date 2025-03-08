document.getElementById("onboarding-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  console.log("event called");

  const formData = new FormData(this);

  const username = document.getElementById("username").value;
  const profilePicture = document.getElementById("profilePic").files[0];

  console.log("username : ",username);
  console.log("profilePicture : ",profilePicture);

  formData.append("username", username);
  if (profilePicture) {
      formData.append("profilePicture", profilePicture);
  }

  try {
    const response = await fetch("/join-chat", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
    });

    if (!response.ok) {
      const errorResult = await response.json(); // Read JSON only once
      alert(`Failed to join chat: ${errorResult.error}`);
      return;
    }

    const result = await response.json(); // Read JSON only once
    console.log("Response:", result);

    window.location.href = `/chat?username=${encodeURIComponent(result.username)}`;
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  }
});
