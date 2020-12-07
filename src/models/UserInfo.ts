import { OwnerInfo } from "./OwnerInfo";
import { VehicleInfo } from './VehicleInfo';

export interface UserInfo {
    userid: number | undefined,
    owner: OwnerInfo | undefined,
    vehicles: VehicleInfo[] | undefined
}