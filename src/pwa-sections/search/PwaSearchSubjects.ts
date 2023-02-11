import { Subject } from 'rxjs';

const PwaSearchSubjects = new Subject();

export const PwaSearchSubjectsFuncs = {
  filterChanged: () => PwaSearchSubjects.next({}),
  getFilterChanged: () => PwaSearchSubjects.asObservable(),
};
