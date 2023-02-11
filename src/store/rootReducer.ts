// api-reducers
import reducersApis from './reducerApis';
// slices
import afterRegistration from './slices/afterRegistration';
import authReducer from './slices/auth';
import allMsgReducer from './slices/chat/allMsgReducer';
import selectMsgReducer from './slices/chat/selectMsgReducer';
import selectedUserReducer from './slices/chat/selectedUser';
import connectionReducer from './slices/connection/connections';
import homePageReducer from './slices/homePage';
import createSocialPostReducer from './slices/post/createSocialPost';
import sendPostReducer from './slices/post/sendPost';
import sharePostReducer from './slices/post/sharePost';
import userEmailsReducer from './slices/profile/contactInfo-slice-eli';
import ngoProfileBioReducer from './slices/profile/ngoProfileBio-slice';
import ngoProjectReducer from './slices/profile/ngoProject-slice';
import ngoPublicDetailsSlice from './slices/profile/ngoPublicDetails-slice';
import userSocialMediasReducer from './slices/profile/socialMedia-slice';
import userCertificatesReducer from './slices/profile/userCertificates-slice';
import userCollegesReducer from './slices/profile/userColloges-slice';
// section slices
import userExperiencesReducer from './slices/profile/userExperiences-slice';
import userLocationReducer from './slices/profile/userLocation-slice';
import userMainInfoReducer from './slices/profile/userMainInfo-slice';
import userPhoneNumberReducer from './slices/profile/userPhoneNumber-slice';
import userRelationShipReducer from './slices/profile/userRelationShip-slice';
import userSchoolsReducer from './slices/profile/userSchool-slice';
import userpersonSkillReducer from './slices/profile/userSkill-slice';
import userUniversityReducer from './slices/profile/userUniversity-slice';
import userWebsitesReducer from './slices/profile/userWebsite-slice';
import searchReducer from './slices/search';
import uploadReducer from './slices/upload';

// ----------------------------------------------------------------------

const rootReducer = {
  ...reducersApis,
  auth: authReducer,
  userRelationShip: userRelationShipReducer,
  userLocation: userLocationReducer,
  ngoProfileBio: ngoProfileBioReducer,
  userExperiences: userExperiencesReducer,
  ngoProject: ngoProjectReducer,
  userEmails: userEmailsReducer,
  userSocialMedias: userSocialMediasReducer,
  userCertificates: userCertificatesReducer,
  userPersonSkill: userpersonSkillReducer,
  userWebsites: userWebsitesReducer,
  userPhoneNumber: userPhoneNumberReducer,
  userColleges: userCollegesReducer,
  userUniversity: userUniversityReducer,
  userSchools: userSchoolsReducer,
  userMainInfo: userMainInfoReducer,
  ngoPublicDetails: ngoPublicDetailsSlice,
  // product: persistReducer(productPersistConfig, productReducer),
  createSocialPost: createSocialPostReducer,
  sharePost: sharePostReducer,
  sendPost: sendPostReducer,
  homePage: homePageReducer,
  upload: uploadReducer,
  selectMsg: selectMsgReducer,
  allMsg: allMsgReducer,
  selectedUser: selectedUserReducer,
  // followers: followersReducer,
  connectionsList: connectionReducer,
  searchSlice: searchReducer,
  afterRegister: afterRegistration,
};

export { rootReducer };
