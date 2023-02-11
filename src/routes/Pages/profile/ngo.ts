import { isMobile } from 'react-device-detect';

import asyncComponentLoader from 'src/utils/loader';

const notFoundPath = 'src/pages/NotFound';

// please install #region folding for VS Code extension

/* #region main profile and view  ngo*/

const profileNGO = [
  {
    path: ':userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/owner/ngoMain/MainNGO')
        : import('src/sections/profile/ngo/owner/ngoMain/Main'),
    ),
  },
  {
    path: 'view/certificates/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/view/MoreCertificates')
        : import('src/sections/profile/components/CertificateListView'),
    ),
  },
  {
    path: 'view/contactInfos/:userId', // باید درست شود . فایل ها موجود نیستند
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`) //import('src/pwa-sections/profile/ngo/view/ContactInfoView') باید فایل مورد نظر موجود شود
        : import('src/sections/profile/components/ContactInfoView'),
    ),
  },
  {
    path: 'view/projects/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/view/MoreProjects')
        : import('src/sections/profile/ngo/view/ProjectListView'),
    ),
  },
  {
    path: 'view/:userId',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/view/ProfileView')
        : import('src/sections/profile/ngo/view/NgoMainView'),
    ),
  },
  {
    path: 'ngo-wizard-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import('src/pwa-sections/profile/ngo/wizard/NgoWizardList')
        : import('src/sections/profile/ngo/wizard/WizardList'),
    ),
  },
  {
    path: 'bio-dialog',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import('src/sections/profile/ngo/owner/ngoMain/BioDialog'),
    ),
  },
  {
    path: 'bio/:id',
    element: asyncComponentLoader(() =>
      isMobile ? import('src/pwa-sections/profile/ngo/owner/ngoMain/bio/BioNgo') : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'main-profile-ngo-change-avatar-photo',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGOChangePhotoDialog'),
    ),
  },
  {
    path: 'main-profile-ngo-change-cover-photo',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGOChangePhotoDialog'),
    ),
  },
  {
    path: 'ngoEdit-cover',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGOCoverAvatarDialog'),
    ),
  },
  {
    path: 'ngoEdit-avatar',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGOCoverAvatarDialog'),
    ),
  },
  {
    path: 'main-profile-ngo-delete-avatar-dialog',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGODeleteDialog'),
    ),
  },
  {
    path: 'main-profile-ngo-delete-cover-dialog',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import('src/sections/profile/ngo/owner/ngoMain/MainProfileNGODeleteDialog'),
    ),
  },
];
/* #endregion */

/* #region project ngo*/

const projectsNgo = [
  {
    path: 'project-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoProject/ProjectList`)
        : import(`src/sections/profile/ngo/owner/ngoProject/ProjectListDialog`),
    ),
  },
  {
    path: 'project-new',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoProject/ProjectNew`)
        : import(`src/sections/profile/ngo/owner/ngoProject/ProjectNewDialog`),
    ),
  },
  {
    path: 'project-start-date',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectDateDialog`),
    ),
  },
  {
    path: 'project-end-date',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectDateDialog`),
    ),
    // <ProjectDateDialog isEndDate />,
  },
  {
    path: 'project-location',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectLocationDialog`),
    ),
  },
  {
    path: 'project-photo',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectPhotoDialog`),
    ),
  },
  {
    path: 'project-edit-photo',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectEditPhotoDialog`),
    ),
  },
  {
    path: 'project-delete',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoProject/ProjectDeleteConfirmDialog`),
    ),
  },
  {
    path: 'project-discard',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoProject/ProjectDiscardDialog`),
    ),
  },
  {
    path: 'project-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoProject/SelectProjectAudienceDialog`),
    ),
  },
];
/* #endregion */

/* #region Contact info ngo */

const contactInfoNGO = [
  {
    path: 'contact-info',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ContactInfoMain`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/NGOContactInfoMainDialog`),
    ),
  },
  //   EMAIL
  {
    path: 'email-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoEmail/UpsertPersonEmailForm`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/UpsertPersonEmailForm`),
    ),
  },
  {
    path: 'verify-email',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoEmail/VerifyCodeForm`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/VerifyCodeForm`),
    ),
  },
  {
    path: 'email-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/EmailDeleteDialog`),
    ),
  },
  {
    path: 'confirm-password-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoEmail/ConfirmPasswordForm`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/ConfirmPasswordForm`),
    ),
  },
  {
    path: 'email-discard-saveChange',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/EmailDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-email',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/SelectAudienceDialog`),
    ),
  },
  // PHONE NUMBER
  {
    path: 'add-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/UpsertPhoneNumber`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/UpsertPhoneNumber`),
    ),
  },
  {
    path: 'edit-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/UpsertPhoneNumber`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/UpsertPhoneNumber`),
    ),
  },
  {
    path: 'verify-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/VerifyCodeFormPhoneNumber`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/VerifyCodeFormPhoneNumber`),
    ),
  },
  {
    path: 'confirm-password',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/ConfirmPasswordForm`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/ConfirmPassword`),
    ),
  },
  {
    path: 'discard-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/PhoneNumberDiscardDialog`),
    ),
  },
  {
    path: 'confirm-delete-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/ConfirmDeletePhoneNumber`),
    ),
  },
  {
    path: 'select-audience-phone-number',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/SelectAudiencePhoneNumber`),
    ),
  },
  //SOICIAL LINK
  {
    path: 'social-link-form',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/UpsertPersonSocialLink`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/UpsertPersonSocialLinkForm`),
    ),
  },
  {
    path: 'social-link-platform',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkPlatformDialoge`),
    ),
  },
  {
    path: 'social-link-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkDeleteDialog`),
    ),
  },
  {
    path: 'socialLink-discard-saveChange',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkDiscardDialog`),
    ),
  },
  {
    path: 'select-audience-socialMedia',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SelectAudienceSocialMediaDialog`),
    ),
  },
  // WEBSITE
  {
    path: 'add-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/UpsertWebsite`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/UpsertWebsite`),
    ),
  },
  {
    path: 'edit-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/UpsertWebsite`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/UpsertWebsite`),
    ),
  },
  {
    path: 'discard-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/WebsiteDiscardDialog`),
    ),
  },
  {
    path: 'confirm-delete-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/ConfirmDeleteWebsite`),
    ),
  },
  {
    path: 'select-audience-website',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/SelectAudienceWebsite`),
    ),
  },
];
/* #endregion */

/* #region public details ngo */

const publicDetailsNgo = [
  {
    path: 'public-details',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoPublicDetails/PublicDetailsMain`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/NGOPublicDetailsMainDialog`),
    ),
  },
  {
    path: 'select-audience-main',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/SelectAudienceMainDialog`),
    ),
  },
  //CATEGORY
  {
    path: 'public-details-category',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryUpdateDialog`),
    ),
  },
  {
    path: 'public-details-category/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryUpdate`)
        : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'public-details-category-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/SelectAudienceCategoryDialog`),
    ),
  },
  {
    path: 'public-details-select-category',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryTypeDialog`),
    ),
  },
  {
    path: 'public-details-delete-category',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryDeleteDialog`),
    ),
  },
  {
    path: 'public-details-edit-category',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryUpdateDialog`),
    ),
  },
  {
    path: 'public-details-discard-category',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoCategory/CategoryDiscardDialog`),
    ),
  },
  // SIZE
  {
    path: 'public-details-size',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeUpdateDialog`),
    ),
  },
  {
    path: 'public-details-edit-size',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeUpdateDialog`),
    ),
  },
  {
    path: 'public-details-size/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeUpdate`)
        : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'public-details-size-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeSelectAudienceDialog`),
    ),
  },
  {
    path: 'public-details-select-size',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeStatusDialog`),
    ),
  },
  {
    path: 'public-details-delete-size',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeDeleteDialog`),
    ),
  },
  {
    path: 'public-details-discard-size',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoSize/SizeDiscardDialog`),
    ),
  },
  // ESTABLISHMENT DATE
  {
    path: 'public-details-establishment',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/EstablishedDateUpdateDialog`),
    ),
  },
  {
    path: 'public-details-edit-establishment',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/EstablishedDateUpdateDialog`),
    ),
  },
  {
    path: 'public-details-establishment/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoPublicDetails/ngoDateOfEstablished/EstablishedDateUpdate`)
        : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'public-details-established-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/EstablishedDateDialog`),
    ),
  },
  {
    path: 'public-details-establishment-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(
            `src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/SelectAudienceEstablishedDateDialog`
          ),
    ),
  },
  {
    path: 'public-details-delete-established-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/EstablishmentDeleteDialog`),
    ),
  },
  {
    path: 'public-details-discard-established-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngEstablishedDate/EstablishmentDiscardDialog`),
    ),
  },
  // PLACE
  {
    path: 'public-details-place',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationUpdateDialog`),
    ),
  },
  {
    path: 'public-details-place/:id',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationUpdate`)
        : import(`${notFoundPath}`),
    ),
  },
  {
    path: 'public-details-located-in',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationNameDialog`),
    ),
  },
  {
    path: 'public-details-edit-place',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationUpdateDialog`),
    ),
  },
  {
    path: 'public-details-place-audience',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/SelectAudienceLocationDialog`),
    ),
  },
  {
    path: 'public-details-delete-place',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationDeleteDialog`),
    ),
  },
  {
    path: 'public-details-discard-place',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoPublicDetails/ngoLocation/LocationDiscardDialog`),
    ),
  },
];

/* #endregion */

/* #region certificate ngo */

const certificateNgo = [
  {
    path: 'certificate-list',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoCertificates/CertificateList`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/CertificateListDialog`),
    ),
  },
  {
    path: 'update-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`src/pwa-sections/profile/ngo/owner/ngoCertificates/AddCertificate`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/AddCertificateDialog`),
    ),
  },
  {
    path: 'search-certificate-name',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/SearchCertificateNamesDialog`),
    ),
  },
  {
    path: 'search-issuing-organization',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/SearchIssingOrganizationDialog`),
    ),
  },
  {
    path: 'certificate-issue-date',
    element: asyncComponentLoader(() =>
      isMobile ? import(`${notFoundPath}`) : import(`src/sections/profile/ngo/owner/ngoCertificates/IssueDateDialog`),
    ),
  },
  {
    path: 'certificate-expiration-date',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/ExpirationDateDialog`),
    ),
  },
  {
    path: 'certificate-delete-confirm',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/DeleteConfirmDialog`),
    ),
  },
  {
    path: 'discard-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates/DiscardCertificateDialog`),
    ),
  },
  {
    path: 'select-audience-certificate',
    element: asyncComponentLoader(() =>
      isMobile
        ? import(`${notFoundPath}`)
        : import(`src/sections/profile/ngo/owner/ngoCertificates//SelectAudienceCertificateDialog`),
    ),
  },
];
/* #endregion */

const exportFiles = [...profileNGO, ...projectsNgo, ...contactInfoNGO, ...publicDetailsNgo, ...certificateNgo];
export default exportFiles;
