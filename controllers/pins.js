//============================================================================
// MapKit.pinsController
//============================================================================
/*globals MapKit*/

/**

  The pins controller will hold all of the pins dropped on the map
  @extends SC.ArrayController
  @author Josh Holt
  @version 0.1.0
  @since 0.1.0

*/

MapKit.pinsController = SC.ArrayController.create({
  contentBinding: 'MapKit.PINS',
  allowsEmptySelection: NO
});