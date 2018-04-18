  var _mask_obj = {
    mask:0,
    formid:0,
    formid_dom:0,
    check_mask:function(formid){
      if(!this.mask) this.mask = document.querySelector(".mask");
      if(formid != this.formid || !this.formid_dom) {
        this.formid = formid;
        this.formid_dom = document.querySelector(formid);
      }
    }
  }
  // 展示表单
  function showform(formid){
    _mask_obj.check_mask(formid);

    // $(".mask").removeClass('hidden');
    // $(formid).removeClass('hidden');
    _mask_obj.mask.className = _mask_obj.mask.className.replace(/\s?hidden/,"");
    _mask_obj.formid_dom.className = _mask_obj.formid_dom.className.replace(/\s?hidden/,"");
  }

  // 隐藏表单
  function hiddenform(formid){
    _mask_obj.check_mask(formid);

    // $(".mask").addClass('hidden');
    // $(formid).addClass('hidden');
    if(!_mask_obj.mask.className.match(/hidden/g)) _mask_obj.mask.className = _mask_obj.mask.className.replace(/\s?$/," hidden");
    if(!_mask_obj.formid_dom.className.match(/hidden/g)) _mask_obj.formid_dom.className = _mask_obj.formid_dom.className.replace(/\s?$/," hidden");
  }
