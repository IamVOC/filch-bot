import { addUser, getUser, addCommit, getCommit, addMetrics, getSimilarMetrics } from "./repositories.js";


export default (app) => {
	app.on("pull_request.opened", async (context) => {
		const owner = context.payload.repository.owner.id
		const prId = context.payload.pull_request.id
		const user = await getUser(owner)
		if (!user.length) {
			await addUser({userId: owner})
		}
		const pr = await getCommit(prId)
		if (!pr.length) {
			await addCommit({commitId: prId, userId: owner})
		}
		//
		console.log(context.payload)
		await context.octokit.rest.issues.createComment({
			body: "lol",	
			owner: context.payload.repository.owner.login,
			repo: context.payload.repository.name,
			issue_number: context.payload.pull_request.number,
		});
	})

	app.on(['check_suite.requested'], async context => {
	    const { head_branch, head_sha } = context.payload.check_suite;
		const runs = await context.octokit.request('GET /repos/{owner}/{repo}/actions/runs?branch={branch}&event={event}', {
			owner: context.payload.repository.owner.login,
			repo: context.payload.repository.name,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			},
			branch: context.payload.pull_request.head.ref,
			event: "pull_request",
		})
		const metric = await context.octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts?name={name}', {
			owner: context.payload.repository.owner.login,
			repo: context.payload.repository.name,
			run_id: runs.workflow_runs[-1].id,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			},
			name: '.gcdump'
		})
		const metrics = await getSimilarMetrics(metric.artifacts[0].size_in_bytes)
		await addMetrics({commitId: context.payload.pull_request.head.ref, allocatedMemory: metric.artifacts[0].size_in_bytes}) 
		if (!metrics.length) {
			await context.github.checks.update(context.repo({
				name: 'FilchCheck',
		        head_branch,
		        head_sha,
				status: 'success',
			}));
		} else {
			await context.github.checks.update(context.repo({
				name: 'FilchCheck',
		        head_branch,
		        head_sha,
				status: 'canceled',
			}));
		}
	});
}
