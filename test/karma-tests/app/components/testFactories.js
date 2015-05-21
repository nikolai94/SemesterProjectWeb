describe('myAppRename.factories', function () {

  beforeEach(module('myAppRename.factories'));

  describe('XXXFactory', function () {
    var orderDato;
    beforeEach(inject(function (_orderDato_) {
      orderDato = _orderDato_;
    }));

    it('should edit the date', function () {
      expect(orderDato.getData(1420434000000)).toBe("05-01-2015");
    });
  });
});