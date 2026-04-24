
async function test() {
  const url = "https://api.github.com/repos/Sunchiii/blogo";
  console.log(`Testing GitHub API ${url} without User-Agent...`);
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    console.log("Status without User-Agent:", res.status);
    if (!res.ok) {
        const text = await res.text();
        console.log("Response text:", text);
    }
  } catch (e) {
    console.error("Error without User-Agent:", e.message);
  }

  console.log(`\nTesting GitHub API ${url} with User-Agent...`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Blogo-App",
        Accept: "application/vnd.github+json",
      },
    });
    console.log("Status with User-Agent:", res.status);
    if (!res.ok) {
        const text = await res.text();
        console.log("Response text:", text);
    }
  } catch (e) {
    console.error("Error with User-Agent:", e.message);
  }
}

test();
