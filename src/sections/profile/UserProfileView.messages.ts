import { defineMessages } from 'react-intl';

const scope = 'peofile.user.view';

const NormalAndNgoProfileViewMessages = defineMessages({
  seeMoreButton: {
    id: `${scope}.seeMoreButton`,
    defaultMessage: 'see more',
  },
  messagebutton: {
    id: `${scope}.messagebutton`,
    defaultMessage: 'Message',
  },
  blockbutton: {
    id: `${scope}.blockbutton`,
    defaultMessage: 'Block',
  },
  unblockbutton: {
    id: `${scope}.unblockbutton`,
    defaultMessage: 'Unblock',
  },
  unfollowbutton: {
    id: `${scope}.unfollowbutton`,
    defaultMessage: 'Unfollow',
  },
  reportButton: {
    id: `${scope}.reportButton`,
    defaultMessage: 'Report',
  },
  acceptButton: {
    id: `${scope}.acceptButton`,
    defaultMessage: 'Accept',
  },
  declineButton: {
    id: `${scope}.declineButton`,
    defaultMessage: 'Decline',
  },
  blockedMessage: {
    id: `${scope}.blockMessage`,
    defaultMessage: 'You have been blocked by this user.',
  },
  privacyMessage: {
    id: `${scope}.privacyMessage`,
    defaultMessage: 'This Account is Private.',
  },
  reportMessage: {
    id: `${scope}.reportMessage`,
    defaultMessage: '{username} is reported by you.',
  },
  noExpirationMessage: {
    id: `${scope}.noExpirationMessage`,
    defaultMessage: 'No Expiration Date',
  },
  presentWord: {
    id: `${scope}.presentWord`,
    defaultMessage: 'Present',
  },
  contactInfo: {
    id: `${scope}.contactInfo`,
    defaultMessage: 'Contact Info',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  phoneNumber: {
    id: `${scope}.phoneNumber`,
    defaultMessage: 'Phone Number',
  },
  socialLinks: {
    id: `${scope}.socialLinks`,
    defaultMessage: 'Social Links',
  },
  website: {
    id: `${scope}.website`,
    defaultMessage: 'Website',
  },
  moreContactInfoMessage: {
    id: `${scope}.moreContactInfoMessage`,
    defaultMessage: 'Show All Contact Info',
  },
  skills: {
    id: `${scope}.skills`,
    defaultMessage: 'Skills',
  },
  skillsAndEndorsements: {
    id: `${scope}.skillsAndEndorsements`,
    defaultMessage: 'Skills and Endorsements',
  },
  endorsedBy: {
    id: `${scope}.endorsedBy`,
    defaultMessage: 'Endorsed By ',
  },
  endorsed: {
    id: `${scope}.endorsed`,
    defaultMessage: 'Endorsed ',
  },
  endorse: {
    id: `${scope}.endorse`,
    defaultMessage: 'Endorse',
  },
  seeMoreSkillMessages: {
    id: `${scope}.seeMoreSkillMessages`,
    defaultMessage: 'See {count} More Skills and Endorsements ',
  },
  certificate: {
    id: `${scope}.certificate`,
    defaultMessage: 'Certificate',
  },
  seeCertificate: {
    id: `${scope}.seeCertificate`,
    defaultMessage: 'See Certificate',
  },
  issuingOrganizationMessage: {
    id: `${scope}.issuingOrganizationMessage`,
    defaultMessage: 'issuingOrganization : {title}',
  },
  credentialID: {
    id: `${scope}.credentialID`,
    defaultMessage: 'Credential ID {CredentialID}',
  },
  seeMoreCertificateMessages: {
    id: `${scope}.seeMoreCertificateMessages`,
    defaultMessage: 'See {count} More Certificate',
  },
  experiences: {
    id: `${scope}.experiences`,
    defaultMessage: 'Experiences',
  },
  experienceTitle: {
    id: `${scope}.experienceTitle`,
    defaultMessage: '{title} at {name}',
  },
  experienceInfo: {
    id: `${scope}.experienceInfo`,
    defaultMessage: '{title} <Typography> At {name}</Typography>',
  },
  seeMoreExperienceMessages: {
    id: `${scope}.seeMoreExperienceMessages`,
    defaultMessage: 'See {count} More Experiences ',
  },
  joinMessage: {
    id: `${scope}.joinMessage`,
    defaultMessage: 'Joined {brand} at <Typography>{Date}</Typography>',
  },
  universityInfo: {
    id: `${scope}.universityInfo`,
    defaultMessage: 'studied {title} <Typography>at {name} from {startDate} until {endDate}</Typography>',
  },
  schoolInfo: {
    id: `${scope}.schoolInfo`,
    defaultMessage: 'Went to {title} <Typography> at {year}</Typography>',
  },
  homeTownInfo: {
    id: `${scope}.homeTownInfo`,
    defaultMessage: 'From <Typography>{homeTown}</Typography>',
  },
  currentCityInfo: {
    id: `${scope}.currentCityInfo`,
    defaultMessage: 'Lives in <Typography>{name}</Typography>',
  },
  joined: {
    id: `${scope}.joined`,
    defaultMessage: 'Joined',
  },
  ngoCategory: {
    id: `${scope}.ngoCategory`,
    defaultMessage: '{NGO} Category <Typography>{title}</Typography>',
  },
  ngoSize: {
    id: `${scope}.ngoSize`,
    defaultMessage: '{NGO} Size <Typography>{title}</Typography>',
  },
  ngoEstablishmentDate: {
    id: `${scope}.ngoEstablishmentDate`,
    defaultMessage: 'Date of Establishment <Typography>{date}</Typography>',
  },
  ngoplaceInfo: {
    id: `${scope}.ngoplaceInfo`,
    defaultMessage: 'Located in <Typography>{place}</Typography>',
  },
  ngoprojectTitle: {
    id: `${scope}.ngoprojectTitle`,
    defaultMessage: 'Project',
  },
  seeMoreProjectMessage: {
    id: `${scope}.seeMoreProjectMessage`,
    defaultMessage: 'See {count} More Project',
  },
  issued: {
    id: `${scope}.issued`,
    defaultMessage: 'Issued',
  },
  profileViews: {
    id: `${scope}.profileViews`,
    defaultMessage: 'Profile Views',
  },
  searchAppernce: {
    id: `${scope}.searchAppernce`,
    defaultMessage: 'Search appernce',
  },
  hasNoFollowingMessage: {
    id: `${scope}.hasNoFollowingMessage`,
    defaultMessage: '{name} have no following',
  },
  hasNoFollowerMessage: {
    id: `${scope}.noFollowerMessage`,
    defaultMessage: '{name} have no follower',
  },
  noFollowingMessage: {
    id: `${scope}.noFollowingMessage`,
    defaultMessage: 'You have no following',
  },
  noFollowerMessage: {
    id: `${scope}.noFollowerMessage`,
    defaultMessage: 'You have no follower',
  },
  noRequestMessage: {
    id: `${scope}.noRequestMessage`,
    defaultMessage: 'You have no request',
  },
  noRequestedMessage: {
    id: `${scope}.noRequestedMessage`,
    defaultMessage: 'You have no requested',
  },
  noFollowingTitle: {
    id: `${scope}.noFollowingTitle`,
    defaultMessage: 'No Following',
  },
  noFollowerTitle: {
    id: `${scope}.noFollowerTitle`,
    defaultMessage: 'No Follower',
  },
  noRequestTitle: {
    id: `${scope}.noRequestTitle`,
    defaultMessage: 'No Request',
  },
  noRequestedTitle: {
    id: `${scope}.noRequestedTitle`,
    defaultMessage: 'No Requested',
  },
  seeConnections: {
    id: `${scope}.seeConnections`,
    defaultMessage: 'See connections',
  },
  followReqMessage: {
    id: `${scope}.followReqMessage`,
    defaultMessage: '{name} wants to Follow you',
  },
  seeMorePost: {
    id: `${scope}.seeMorePost`,
    defaultMessage: 'See More Post',
  },
  addPost: {
    id: `${scope}.addPost`,
    defaultMessage: 'Add Post',
  },
  noPost: {
    id: `${scope}.noPost`,
    defaultMessage: 'No Post',
  },
  noMorePost: {
    id: `${scope}.noMorePost`,
    defaultMessage: '{name} have no Post',
  },
  haveNoPost: {
    id: `${scope}.haveNoPost`,
    defaultMessage: 'You have no Post',
  },
  postsLable: {
    id: `${scope}.postsLable`,
    defaultMessage: 'Posts',
  },
  articlesLable: {
    id: `${scope}.postsLable`,
    defaultMessage: 'Articles',
  },
  mentionedLable: {
    id: `${scope}.mentionedLable`,
    defaultMessage: 'Mentioned',
  },
  copyLinkMessage: {
    id: `${scope}.copyLinkMessage`,
    defaultMessage: 'Copy Profile link',
  },
  blockAlertMessage: {
    id: `${scope}.blockAlertMessage`,
    defaultMessage: 'Are you sure you want to Block {username}?',
  },
  unfollowAlertMessage: {
    id: `${scope}.unfollowAlertMessage`,
    defaultMessage: 'Are you sure you want to Unfollow {username}?',
  },
  followersLable: {
    id: `${scope}.followersLable`,
    defaultMessage: 'Followers',
  },
  followingsLable: {
    id: `${scope}.followingsLable`,
    defaultMessage: 'Followings',
  },
});

export default NormalAndNgoProfileViewMessages;
