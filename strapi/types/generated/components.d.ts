import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAward extends Struct.ComponentSchema {
  collectionName: 'components_shared_awards';
  info: {
    description: '\u041D\u0430\u0433\u0440\u0430\u0434\u0430 \u0438\u043B\u0438 \u0434\u0438\u043F\u043B\u043E\u043C';
    displayName: '\u041D\u0430\u0433\u0440\u0430\u0434\u0430';
    icon: 'star';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String;
  };
}

export interface SharedCastMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_cast_members';
  info: {
    description: '\u041C\u0443\u0437\u044B\u043A\u0430\u043D\u0442\u044B, \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0451\u043D\u043D\u044B\u0435 \u0438 \u0434\u0440. \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043D\u0435\u0442 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0435. \u0410\u043A\u0442\u0451\u0440\u043E\u0432 \u0438\u0437 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0430\u043A\u0442\u0451\u0440\u0430 (\u0440\u043E\u043B\u0438 \u0432 \u0441\u043F\u0435\u043A\u0442\u0430\u043A\u043B\u044F\u0445).';
    displayName: '\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A \u0441\u043F\u0435\u043A\u0442\u0430\u043A\u043B\u044F (\u043D\u0435 \u0438\u0437 \u043A\u043E\u043C\u0430\u043D\u0434\u044B)';
    icon: 'user';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFestival extends Struct.ComponentSchema {
  collectionName: 'components_shared_festivals';
  info: {
    description: '\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C \u0438\u043B\u0438 \u043A\u043E\u043D\u043A\u0443\u0440\u0441';
    displayName: '\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C';
    icon: 'movie';
  };
  attributes: {
    place: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String;
  };
}

export interface SharedPartnerItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_partner_items';
  info: {
    description: '\u041B\u043E\u0433\u043E\u0442\u0438\u043F \u0438 \u0441\u0441\u044B\u043B\u043A\u0430 \u043F\u0430\u0440\u0442\u043D\u0451\u0440\u0430/\u0441\u043F\u043E\u043D\u0441\u043E\u0440\u0430';
    displayName: '\u041F\u0430\u0440\u0442\u043D\u0451\u0440';
    icon: 'briefcase';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedReview extends Struct.ComponentSchema {
  collectionName: 'components_shared_reviews';
  info: {
    description: '\u041E\u0442\u0437\u044B\u0432 \u043E \u0441\u043F\u0435\u043A\u0442\u0430\u043A\u043B\u0435 \u0438\u043B\u0438 \u0442\u0435\u0430\u0442\u0440\u0435';
    displayName: '\u041E\u0442\u0437\u044B\u0432';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    vkUrl: Schema.Attribute.String;
  };
}

export interface SharedRoleItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_role_items';
  info: {
    description: '\u0420\u043E\u043B\u044C \u0432 \u0441\u043F\u0435\u043A\u0442\u0430\u043A\u043B\u0435';
    displayName: '\u0420\u043E\u043B\u044C \u0432 \u0441\u043F\u0435\u043A\u0442\u0430\u043A\u043B\u0435';
    icon: 'theater';
  };
  attributes: {
    performance: Schema.Attribute.Relation<
      'manyToOne',
      'api::performance.performance'
    >;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedScheduleItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_schedule_items';
  info: {
    description: '\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u043A\u0430\u0437\u0430';
    displayName: '\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u043A\u0430\u0437\u0430';
    icon: 'calendar';
  };
  attributes: {
    date: Schema.Attribute.String & Schema.Attribute.Required;
    time: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.award': SharedAward;
      'shared.cast-member': SharedCastMember;
      'shared.festival': SharedFestival;
      'shared.partner-item': SharedPartnerItem;
      'shared.review': SharedReview;
      'shared.role-item': SharedRoleItem;
      'shared.schedule-item': SharedScheduleItem;
    }
  }
}
