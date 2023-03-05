import SubstanceBlock from "./SubstanceBlock";

function Question({ questionNumber, question, totalQuestions, substances, selectedOptions, handleChange }) {	
	const progressBarWidth = Math.floor((questionNumber / totalQuestions) * 100);
	return (
		<div className="question-block">
			<p className="d-flex question-text">{`${questionNumber}. ${question.text}`}</p>

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
				{substances?.map(substance => (
					<SubstanceBlock
						key={substance.id}
						questionNumber={questionNumber}
						substance={substance}
						selectedOptions={selectedOptions}
						handleChange={handleChange}
					/>
				))}
			</ol>
		</div>
	);
}

export default Question;
