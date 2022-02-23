//DOM selectors
const projectContainer = document.getElementById ('projectContainer')

//Global selectors
const user = 'josse79'
let reponame = ''
const API_REPOS_LIST = `https://api.github.com/users/${user}/repos`


const getRepos = () => {
     fetch(API_REPOS_LIST)
     .then(res => res.json())
     .then(data => {
        const forkedRepos = data.filter((repo) => repo.fork && repo.name.startsWith('project'))
        console.log(forkedRepos)

      forkedRepos.forEach((repo) => {
        projectContainer.innerHTML += `
        <div class='repos' id=${repo.name}>
          <a class='project-link' href='${repo.html_url}' target='_blank'></a>
            <p>${repo.name}</p>
            <p>Default branch ${repo.default_branch}</p>
            <p>Recent push: ${new Date(repo.pushed_at).toDateString()}</p>
         </div>`
      })
      getPullRequests(forkedRepos)
    })

      const getPullRequests = (repos) => {
        repos.forEach(repo => {
          fetch(`https://api.github.com/repos/technigo/${repo.name}/pulls?per_page=100`)
          .then(res => res.json())
          .then(data => {
            const filteredPulls = data.find((pull) => pull.user.login === repo.owner.login)
            console.log(filteredPulls)
            if (filteredPulls) {
              getCommits(filteredPulls.commits_url, repo.name)
              getReview(filteredPulls.review_comments_url, repo.name)
            } else {
              document.getElementById(`${repo.name}`).innerHTML += `
               <p>No pull request made</p>`
            }
          })
        })
      }
            const getCommits = (URL, repoName) => {
              fetch(URL)
              .then(res => res.json())
              .then(data => {
                document.getElementById(repoName).innerHTML += `
                <p>Number of commits: ${data.length}</p>`
              })
            }
            const getReview = (URL, repoName) => {
              fetch(URL)
              .then(res => res.json())
              .then(data => {
                console.log(data)
                if (`${data[0].user.login} == ''`) {
                document.getElementById(repoName).innerHTML += `
                <p>Review made by: ${data[0].user.login}</p>`
                } else {
                }
              })
            }
  }
    getRepos ()
