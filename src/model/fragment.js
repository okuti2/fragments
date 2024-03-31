// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');
const MarkdownIt = require('markdown-it');


// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');



class Fragment {

  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if(!ownerId || !type ){
        throw new Error("ownerId and type are required");
    }

    if( typeof size !== 'number' || size < 0){
        throw new Error("size must be a positive number");
    }

    if(!Fragment.isSupportedType(type)){
        throw new Error("type is not supported");
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();

  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    logger.debug({ fragments }, 'Fragments by user');
    return fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if(!fragment){
      throw new Error("Fragment not found");
    }
    return new Fragment(fragment);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    const data = await readFragmentData(this.ownerId, this.id);
    return data;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    this.size = data.length;
    this.save();
    // this.updated = new Date().toISOString();
    // await writeFragment(this);
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type.split(';')[0]
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    var validTypes = [];
    switch(this.mimeType){
      case 'text/plain':
        validTypes =  ['text/plain'];
        break;
      case 'text/markdown':
        validTypes = ['text/plain', 'text/html', 'text/markdown'];
        break;
      case 'text/html':
        validTypes = ['text/plain', 'text/html'];
        break;
      case 'text/csv':
        validTypes = ['text/plain', 'application/json', 'text/csv'];
        break;
      case 'application/json':
        validTypes = ['text/plain', 'application/json'];
        break;
      default:
        // I do not need this yet
        // if(this.mimeType.startsWith('image/')){
        //   validTypes = ['image/png', 'image/jpeg', 'image/webp','image/avif', 'image/gif'];
        // }
    }
    return validTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */

  // Update to proper functionality
  static isSupportedType(value) {
    const validTypes = ['application/json'];
    const cType = value.split(';')[0];
    return validTypes.includes(cType) || cType.startsWith('text/');
  }

  convertExtension(ext){
    switch(ext){
      case 'json':
        return 'application/json';
      case 'html':
        return 'text/html';
      case 'csv':
        return 'text/csv';
      case 'md':
        return 'text/markdown';
      case 'txt':
        return 'text/plain';
      case 'png':
        return 'image/png';
      case 'jpg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'avif':
        return 'image/avif';
      case 'gif':
        return 'image/gif';
    }
  }

  // Convert the existing fragment to the given type
  async convertFragment(extension){
    logger.debug({ extension }, 'Converting fragment');
    const newType = this.convertExtension(extension);
    const data = await this.getData();

    if(!this.formats.includes(newType)){
      throw new Error("Unsupported type");
    }
    if(this.type === 'text/markdown' && newType === 'text/html'){
      logger.debug({ newType }, 'Converting markdown to html');
      this.type = newType;
      
      const md = MarkdownIt();
      
      const convertedData = md.render(data.toString());
      logger.debug({ convertedData }, 'Converted fragment');
      this.size = convertedData.length;
      await this.setData(convertedData);
      return convertedData;
    }
    return data;
  }

}

module.exports.Fragment = Fragment;