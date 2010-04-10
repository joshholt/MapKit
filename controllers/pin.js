//============================================================================
// MapKit.pinController
//============================================================================
/*globals MapKit*/

/**

  Controller for a single pin
  @extends SC.ObjectController
  @author Josh Holt 
  @version 0.1.0
  @since 0.1.0

*/

MapKit.pinController = SC.ObjectController.create({
  contentBinding: 'MapKit.pinsController.selection'
});