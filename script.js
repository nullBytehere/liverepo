// --- CONFIGURATION ---
const GITHUB_USERNAME = 'nullBytehere';

// 🛑 FILTER OPTION: যেসব রিপোজিটরি আপনি দেখাতে চান না সেগুলোর নাম নিচে লিখুন।
// উদাহরণ: ['calc', 'taskplanner']
const HIDDEN_REPOS = 
[
'learn-js',
'apurba',
'yoamishishir',
]; 

// 🎯 PRIORITY OPTION: আপনি যেভাবে সিরিয়াল চান, প্রজেক্টের নামগুলো এখানে সেভাবে লিখুন।
// আপনি এখানে যে নামগুলো রাখবেন, সেগুলো একদম শুরুতেই দেখাবে। বাকিগুলো সিরিয়ালের পরে অটোমেটিক থাকবে।
// উদাহরণ: ['Taskplanner', 'Apurba', 'Calc']
const PRIORITY_REPOS = 
[
'mini-militia2-us-apk',
]; 

async function fetchData() {
    const grid = document.getElementById('bento-grid');
    const profileBox = document.getElementById('profile-box');

    try {
        // 1. Profile Fetch
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const user = await userRes.json();
        
        profileBox.innerHTML = `
            <img src="${user.avatar_url}">
            <h2>${user.name || GITHUB_USERNAME}</h2>
            <p>${user.bio || 'Developer'}</p>
            <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="github-btn">
                <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub Profile
            </a>
        `;

        // 2. Repo Fetch
        const repoRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        const repos = await repoRes.json();
        
        // ফিল্টারিং লজিক (হাইড করা এবং মেইন প্রোফাইল বাদ দেওয়া)
        let liveRepos = repos.filter(repo => {
            const isLive = repo.has_pages;
            const isNotMainProfile = repo.name !== `${GITHUB_USERNAME}.github.io`;
            const isNotHidden = !HIDDEN_REPOS.includes(repo.name);
            
            return isLive && isNotMainProfile && isNotHidden;
        });

        // 🔀 সাজানোর লজিক (Sorting base on Priority)
        liveRepos.sort((a, b) => {
            const indexA = PRIORITY_REPOS.indexOf(a.name);
            const indexB = PRIORITY_REPOS.indexOf(b.name);

            // যদি ২টি রিপোজিটরিই প্রায়োরিটি লিস্টে থাকে, তবে লিস্টের সিরিয়াল ফলো করবে
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // যদি শুধু a লিস্টে থাকে, তবে a আগে যাবে
            if (indexA !== -1) return -1;
            // যদি শুধু b লিস্টে থাকে, তবে b আগে যাবে
            if (indexB !== -1) return 1;
            
            // যেগুলো লিস্টে নেই সেগুলো যেমন আছে তেমনই থাকবে (Date অনুযায়ী)
            return 0;
        });

        // কার্ড রেন্ডার করা
        liveRepos.forEach((repo, index) => {
            const card = document.createElement('div');
            const isWide = (index === 0 || index === 3) ? 'wide' : '';
            card.className = `card repo-box ${isWide}`;
            const liveUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}/`;
            
            card.innerHTML = `
                <div>
                    <h3>${repo.name.replace(/-/g, ' ')}</h3>
                    <p>${repo.description || 'A beautiful live project hosted on GitHub.'}</p>
                </div>
                <a href="${liveUrl}" target="_blank" class="btn-live">View Live Demo ↗</a>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        console.error(e);
    }
}

fetchData();