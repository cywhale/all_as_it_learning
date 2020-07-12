import { h, Component } from 'preact';
import { auth, database } from '../firebase';
import CurrentUser from '../CurrentUser';
import ExerciseList from './ExerciseList';
import NewExercise from './NewExercise';
import SignIn from '../SignIn';
import style from './style';

export default class Exercises extends Component {
	constructor() {
		super();

		this.state = {
			currentUser: null,
			exercises: null
		};
	}

	componentDidMount() {
		auth.onAuthStateChanged(currentUser => {
			this.setState({ currentUser });

			const exercisesRef = database.ref(
				'/' + this.state.currentUser.uid + '/exercises'
			);

			exercisesRef.on('value', snapshot => {
				this.setState({ exercises: snapshot.val() });
			});
		});
	}

	render() {
		const { currentUser, exercises } = this.state;

		return (
			<section class="flex">
				{!currentUser && <SignIn />}
				{currentUser &&
										<div class={style.flex}>
											<ExerciseList exercises={exercises} user={currentUser} />
											<NewExercise user={currentUser} />
											<CurrentUser user={currentUser} />
										</div>}
			</section>
		);
	}
}
