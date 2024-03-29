import OptionGroup from "./OptionGroup";

function Question({
	question,
	questionIndex,
	allSubstances,
	substancesToDisplay,
	allSelectedAnswers,
	setAllSelectedAnswers,
	totalQuestions,
}) {	
	const progressBarWidth = Math.floor(((questionIndex + 1) / totalQuestions) * 100);

	return (
		<div className="question-block">
			<p className="d-flex question-text">{`${questionIndex + 1}. ${question.text}`}</p>

			{/* Progress Bar */}
			<div className="progress mb-4">
				<div
					className="progress-bar bg-success"
					role="progressbar"
					style={{ width: `${progressBarWidth}%` }}
					aria-valuenow={progressBarWidth}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					{`${progressBarWidth}%`}
				</div>
			</div>

			<ol className="list-group list-group-flush">
				{substancesToDisplay?.map(substance => (
					<OptionGroup
						key={substance.id}
						questionId={question.id}
						category={substance}
						allSubstances={allSubstances}
						allSelectedAnswers={allSelectedAnswers}
						setAllSelectedAnswers={setAllSelectedAnswers}
					/>
				))}
			</ol>
		</div>
	);
}

export default Question;
