/**
 *  PubSub
 *  @author Chris Nelson
 *	Global PubSub object for dispatch and delegation
 */

const PubSub = {};

_.extend( PubSub, Backbone.Events );

export default PubSub;
