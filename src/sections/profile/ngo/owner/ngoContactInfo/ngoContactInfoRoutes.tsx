import { ReactNode } from 'react';

import ConfirmPasswordForm from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/ConfirmPasswordForm';
import EmailDeleteDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/EmailDeleteDialog';
import EmailDiscardDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/EmailDiscardDialog';
import SelectAudienceDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/SelectAudienceDialog';
import UpsertPersonEmailForm from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/UpsertPersonEmailForm';
import VerifyCodeFormEmail from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmails/VerifyCodeForm';
import ConfirmDeletePhoneNumber from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/ConfirmDeletePhoneNumber';
import ConfirmPassword from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/ConfirmPassword';
import PhoneNumberDiscardDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/PhoneNumberDiscardDialog';
import SelectAudiencePhoneNumber from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/SelectAudiencePhoneNumber';
import UpsertPhoneNumber from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/UpsertPhoneNumber';
import VerifyCodeFormPhoneNumber from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/VerifyCodeFormPhoneNumber';
import SelectAudienceSocialMediaDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SelectAudienceSocialMediaDialog';
import SocialLinkDeleteDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkDeleteDialog';
import SocialLinkDiscardDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkDiscardDialog';
import SocialLinkPlatformDialoge from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/SocialLinkPlatformDialoge';
import UpsertPersonSocialLinkForm from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoSocialLinks/UpsertPersonSocialLinkForm';
import ConfirmDeleteWebsite from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/ConfirmDeleteWebsite';
import SelectAudienceWebsite from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/SelectAudienceWebsite';
import UpsertWebsite from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/UpsertWebsite';
import WebsiteDiscardDialog from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoWebsite/WebsiteDiscardDialog';

import NGOContactInfoMainDialog from './NGOContactInfoMainDialog';

const ngoContactInfoRoutes: Record<string, ReactNode> = {
  'contact-info': <NGOContactInfoMainDialog />,
  //   EMAIL
  'email-form': <UpsertPersonEmailForm />,
  'verify-email': <VerifyCodeFormEmail />,
  'email-delete-confirm': <EmailDeleteDialog />,
  'confirm-password-form': <ConfirmPasswordForm />,
  'email-discard-saveChange': <EmailDiscardDialog />,
  'select-audience-email': <SelectAudienceDialog />,
  // PHONE NUMBER
  'add-phone-number': <UpsertPhoneNumber />,
  'edit-phone-number': <UpsertPhoneNumber />,
  'verify-phone-number': <VerifyCodeFormPhoneNumber />,
  'confirm-password': <ConfirmPassword />,
  'discard-phone-number': <PhoneNumberDiscardDialog />,
  'confirm-delete-number': <ConfirmDeletePhoneNumber />,
  'select-audience-phone-number': <SelectAudiencePhoneNumber />,
  // SICIAL LINK
  'social-link-form': <UpsertPersonSocialLinkForm />,
  'social-link-platform': <SocialLinkPlatformDialoge />,
  'social-link-delete-confirm': <SocialLinkDeleteDialog />,
  'socialLink-discard-saveChange': <SocialLinkDiscardDialog />,
  'select-audience-socialMedia': <SelectAudienceSocialMediaDialog />,
  // WEBSITE
  'add-website': <UpsertWebsite />,
  'edit-website': <UpsertWebsite />,
  'discard-website': <WebsiteDiscardDialog />,
  'confirm-delete-website': <ConfirmDeleteWebsite />,
  'select-audience-website': <SelectAudienceWebsite />,
};

export default ngoContactInfoRoutes;
