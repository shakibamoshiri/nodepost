// update time based on last modification
function updateTime( file, time ){
	const update =
	`<div class="update">
		<hr>
		<i>Update: DD_MM_YYYY</i>
	</div>`;

	return file.replace( "DD_MM_YYYY", update )
			   .replace( "DD_MM_YYYY", time );

}

module.exports = updateTime;
