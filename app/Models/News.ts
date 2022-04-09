import { DateTime } from 'luxon'
import { afterDelete, BaseModel, beforeSave, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import ImageHelper from 'App/Helpers/ImageHelper';
import User from './User';
import { appUrl, isDevelopment } from 'Config/app';
import Escape from 'escape-html'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number;

  @column()
  public title: string;

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true
  })
  public slug: string;

  @column()
  public content: string;

  @column()
  public thumbnail: string;

  @computed()
  public get thumbnailUrl() {
    if (isDevelopment) {
      return 'http://' + appUrl + '/' + this.thumbnail
    }
    return 'https://' + appUrl + '/' + this.thumbnail
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterDelete()
  public static async deleteThumbnail(news: News) {
    ImageHelper.delete(news.thumbnail)
  }

  @beforeSave()
  public static async beforeSaveHook(news: News) {
    news.content = Escape(news.content)
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
