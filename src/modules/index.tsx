import loadable from '@loadable/component';
import { Loading } from '@/components/ui/loading';

const SignIn = loadable(() => import('./auth/pages/sign-in'), {
  fallback: <Loading />,
});
const StudentPanel = loadable(() => import('./student-panel/pages'), {
  fallback: <Loading />,
});
const Profile = loadable(() => import('./profile/pages'), {
  fallback: <Loading />,
});
const Schedule = loadable(() => import('./schedule/pages'), {
  fallback: <Loading />,
});
const FinishedLesson = loadable(() => import('./finished-lesson/pages'), {
  fallback: <Loading />,
});
const SubjectLesson = loadable(() => import('./subject-lesson/pages'), {
  fallback: <Loading />,
});

export {
    SignIn,
    StudentPanel,
    Profile,
    Schedule,
    FinishedLesson,
    SubjectLesson,
}