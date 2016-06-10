/**
 * PubSub
 * @author: Chris Nelson <cnelson87@gmail.com>
 * @description: Global event bus for dispatch and delegation.
 */

const PubSub = {};

_.extend(PubSub, Backbone.Events);

export default PubSub;
