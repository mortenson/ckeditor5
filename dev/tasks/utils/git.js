/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const tools = require( './tools' );

module.exports = {
	/**
	 * Holds boilerplate repository Git URL.
	 *
	 * @private
	 * @readonly
	 * @type {String}
	 */
	BOILERPLATE_REPOSITORY: 'git@github.com:ckeditor/ckeditor-boilerplate.git',

	/**
	 * Holds boilerplate branch used in CKEditor5 projects.
	 *
	 * @private
	 * @readonly
	 * @type {String}
	 */
	BOILERPLATE_BRANCH: 'ckeditor5',

	/**
	 * Parses GitHub URL. Extracts used server, repository and branch.
	 *
	 * @param {String} url GitHub URL from package.json file.
	 * @returns {Object} urlInfo
	 * @returns {String} urlInfo.server
	 * @returns {String} urlInfo.repository
	 * @returns {String} urlInfo.branch
	 */
	parseRepositoryUrl( url ) {
		const regexp = /^(git@github\.com:|https?:\/\/github.com\/)?([^#]+)(?:#)?(.*)$/;
		const match = url.match( regexp );
		let server;
		let repository;
		let branch;

		if ( !match ) {
			return null;
		}

		server = match[ 1 ] || 'https://github.com/';
		repository = match[ 2 ] || '';
		branch = match[ 3 ] || 'master';

		if ( !repository ) {
			return null;
		}

		return {
			server: server,
			repository: repository,
			branch: branch
		};
	},

	/**
	 * Clones repository to workspace.
	 *
	 * @param {Object} urlInfo Parsed URL object from {@link #parseRepositoryUrl}.
	 * @param {String} workspacePath Path to the workspace location where repository will be cloned.
	 */
	cloneRepository( urlInfo, workspacePath ) {
		const cloneCommands = [
			`cd ${ workspacePath }`,
			`git clone ${ urlInfo.server + urlInfo.repository }`
		];

		tools.shExec( cloneCommands.join( ' && ' ) );
	},

	/**
	 * Checks out branch on selected repository.
	 *
	 * @param {String} repositoryLocation Absolute path to repository.
	 * @param {String} branchName Name of the branch to checkout.
	 */
	checkout( repositoryLocation, branchName ) {
		const checkoutCommands = [
			`cd ${ repositoryLocation }`,
			`git checkout ${ branchName }`
		];

		tools.shExec( checkoutCommands.join( ' && ' ) );
	},

	/**
	 * Pulls specified branch from origin.
	 *
	 * @param {String} repositoryLocation Absolute path to repository.
	 * @param {String} branchName Branch name to pull.
	 */
	pull( repositoryLocation, branchName ) {
		const checkoutCommands = [
			`cd ${ repositoryLocation }`,
			`git pull origin ${ branchName }`
		];

		tools.shExec( checkoutCommands.join( ' && ' ) );
	},

	/**
	 * Initializes new repository, adds and merges CKEditor5 boilerplate project.
	 *
	 * @param {String} repositoryPath Absolute path where repository should be created.
	 */
	initializeRepository( repositoryPath ) {
		const initializeCommands = [
			`git init ${ repositoryPath }`,
			`cd ${ repositoryPath }`,
			`git remote add boilerplate ${ this.BOILERPLATE_REPOSITORY }`,
			`git fetch boilerplate ${ this.BOILERPLATE_BRANCH }`,
			`git merge boilerplate/${ this.BOILERPLATE_BRANCH }`
		];

		tools.shExec( initializeCommands.join( ' && ' ) );
	},

	/**
	 * Returns Git status of repository stored under specified path. It runs `git status --porcelain -sb` command.
	 *
	 * @param {String} repositoryPath Absolute path to repository.
	 * @returns {String} Executed command's result.
	 */
	getStatus( repositoryPath ) {
		return tools.shExec( `cd ${ repositoryPath } && git status --porcelain -sb` );
	},

	/**
	 * Updates boilerplate project in specified repository.
	 * @param {String} repositoryPath Absolute path to repository.
	 */
	updateBoilerplate( repositoryPath ) {
		// Try to add boilerplate remote if one is not already added.
		try {
			tools.shExec( `cd ${ repositoryPath } && git remote add boilerplate ${ this.BOILERPLATE_REPOSITORY }` );
		} catch ( error ) { }

		const updateCommands = [
			`cd ${ repositoryPath }`,
			`git fetch boilerplate ${ this.BOILERPLATE_BRANCH }`,
			`git merge boilerplate/${ this.BOILERPLATE_BRANCH }`
		];

		tools.shExec( updateCommands.join( ' && ' ) );
	}
};
