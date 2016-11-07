/**
 * Created by Administrator on 2016/07/05.
 */
namespace app {
    'use strict';

    /**
     * The StaffShareService is used to save the staff informations.
     */
    export class StaffShareService {
        private staffs: Array<Staff> = undefined;

        constructor(){
        }

        /**
         * Get the staff informations.
         *
         * @returns {Array<Staff>}
         */
        get(): Array<Staff> {
            // return the copy of the staff informations.
            return this.staffs;
        }

        /**
         * Set the staff informations.
         *
         * @param staffs
         */
        set(staffs: Array<Staff>) {
            this.staffs = staffs;
            this.convCodeToValue(this.staffs);
        }

        /**
         * Convert the code to the value.
         *
         * @param staffs
         */
        private convCodeToValue(staffs : Array<Staff>) {
            if(staffs && staffs instanceof Array){
                staffs.forEach(function(item: Staff, index: number) {
                    item.levelNm = getLevelValue(item.level);
                    item.sexNm = getSexValue(item.sex);
                    item.workFlagNm = getWorkFlagValue(item.workFlag);
                    item.languageNm = getLanguageValue(item.language);
                })
            }
        }

        /**
         * Delete the specified staff.
         *
         * @param staff
         */
        delete(staff: Staff) {
            for(let index = 0, count = this.staffs.length; index < count; ++index) {
                if(this.staffs[index].id == staff.id){
                    this.staffs.splice(index, 1);
                    break;
                }
            }
        }

        /**
         * Save the specified staff.
         *
         * @param staff
         */
        save(staff: Staff) {
            this.staffs.push(staff);
            this.convCodeToValue(this.staffs);
        }

        /**
         * Update the specified staff.
         *
         * @param staff
         */
        update(staff: Staff) {
            if(this.staffs && this.staffs instanceof Array){
                for(let index = 0, count = this.staffs.length; index < count; ++index) {
                    if(this.staffs[index].id == staff.id){
                        this.staffs.splice(index, 1, staff);
                        break;
                    }
                }
                this.convCodeToValue(this.staffs);
            }
        }
    }

    angularModule.service('staffShareService', StaffShareService);
}
