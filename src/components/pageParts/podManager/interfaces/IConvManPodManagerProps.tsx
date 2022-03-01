import { IUxPod } from "../../../../models/entities/base/IUxPod";


export type IConvManPodManagerProps = {
  isOpen: boolean;
  onToggleOpen(open: boolean): void;
  onPodCreated(pod: IUxPod): void;
};
