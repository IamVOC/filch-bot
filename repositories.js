import { User, UserCommits, CommitMetrics } from './models.js' 

export async function addUser(data) {
	const user = await User.create(data)
}

export async function getUser(userId) {
	const user = await User.findAll({where: {userId}})
	return user
}

export async function addCommit(data) {
	const commit = await UserCommits.create(data)
}

export async function getCommit(commitId) {
	const commit = await UserCommits.findAll({where: {commitId}})
	return commit
}

export async function addMetrics(data) {
	const metrics = await CommitMetrics.create(data)
}

export async function getSimilarMetrics(allocMemory) {
	const metrics = await CommitMetrics.findAll({
		where: {
			allocatedMemory: allocMemory
		}
	})
	return metrics
}
